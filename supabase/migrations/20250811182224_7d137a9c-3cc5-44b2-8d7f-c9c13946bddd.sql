-- 1) Create clicks table mirroring impression_tracking semantics
CREATE TABLE IF NOT EXISTS public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  campaign_id UUID NOT NULL,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own clicks (same as impression_tracking which is permissive true, but we will scope to user)
DROP POLICY IF EXISTS "Allow clicks tracking" ON public.clicks;
CREATE POLICY "Users can manage their own clicks"
ON public.clicks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Optional helpful indexes
CREATE INDEX IF NOT EXISTS idx_clicks_campaign ON public.clicks (campaign_id);
CREATE INDEX IF NOT EXISTS idx_clicks_user ON public.clicks (user_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON public.clicks (created_at);

-- 2) Add spend_cents to impression_tracking so we can aggregate spend (stored as integer cents for precision)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'impression_tracking' AND column_name = 'spend_cents'
  ) THEN
    ALTER TABLE public.impression_tracking ADD COLUMN spend_cents BIGINT DEFAULT 0;
  END IF;
END $$;

-- Index on impression_tracking for performance
CREATE INDEX IF NOT EXISTS idx_impressions_campaign ON public.impression_tracking (campaign_id);
CREATE INDEX IF NOT EXISTS idx_impressions_user ON public.impression_tracking (user_identifier);
CREATE INDEX IF NOT EXISTS idx_impressions_created_at ON public.impression_tracking (created_at);

-- 3) Create a stable security definer function to map user_identifier to user_id when possible
-- For simplicity, assume user_identifier stores auth.uid()::text; otherwise, aggregate by campaigns owned by the current user
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid();
$$;

-- 4) Create a view that aggregates metrics per-user across all campaigns they own
DROP VIEW IF EXISTS public.user_metrics_summary CASCADE;
CREATE VIEW public.user_metrics_summary AS
WITH owned_campaigns AS (
  SELECT c.id as campaign_id, c.user_id
  FROM public.campaigns c
)
, imp AS (
  SELECT oc.user_id,
         COALESCE(SUM(it.impression_count), 0) AS total_impressions,
         COALESCE(SUM(it.spend_cents), 0) AS total_spend_cents
  FROM owned_campaigns oc
  JOIN public.impression_tracking it ON it.campaign_id = oc.campaign_id
  GROUP BY oc.user_id
)
, clk AS (
  SELECT oc.user_id,
         COALESCE(COUNT(*), 0) AS total_clicks
  FROM owned_campaigns oc
  JOIN public.clicks cl ON cl.campaign_id = oc.campaign_id
  GROUP BY oc.user_id
)
SELECT
  u.user_id,
  COALESCE(imp.total_impressions, 0) AS total_impressions,
  COALESCE(clk.total_clicks, 0) AS total_clicks,
  COALESCE(imp.total_spend_cents, 0) AS total_spend_cents,
  CASE WHEN COALESCE(imp.total_impressions,0) > 0
       THEN ROUND((COALESCE(clk.total_clicks,0)::numeric / imp.total_impressions::numeric) * 100, 2)
       ELSE 0
  END AS ctr_percent
FROM (
  SELECT DISTINCT user_id FROM owned_campaigns
) u
LEFT JOIN imp ON imp.user_id = u.user_id
LEFT JOIN clk ON clk.user_id = u.user_id;

-- 5) Add RLS on the view using a security barrier wrapper (create a function to read current user's row)
CREATE OR REPLACE FUNCTION public.get_user_metrics()
RETURNS TABLE (
  user_id uuid,
  total_impressions bigint,
  total_clicks bigint,
  total_spend_cents bigint,
  ctr_percent numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT ums.user_id, ums.total_impressions, ums.total_clicks, ums.total_spend_cents, ums.ctr_percent
  FROM public.user_metrics_summary ums
  WHERE ums.user_id = auth.uid();
$$;

-- 6) Ensure campaigns RLS already allows owner management (already present per schema); create helper RPCs for status/budget updates
DROP FUNCTION IF EXISTS public.update_campaign_status(uuid, text);
CREATE OR REPLACE FUNCTION public.update_campaign_status(p_campaign_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.campaigns
  SET status = p_status, updated_at = now()
  WHERE id = p_campaign_id AND user_id = auth.uid();
END;
$$;

DROP FUNCTION IF EXISTS public.update_campaign_budget(uuid, numeric, numeric, timestamptz, timestamptz);
CREATE OR REPLACE FUNCTION public.update_campaign_budget(
  p_campaign_id uuid,
  p_budget numeric,
  p_daily_budget numeric,
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.campaigns
  SET budget = p_budget,
      daily_budget = p_daily_budget,
      start_date = p_start_date,
      end_date = p_end_date,
      updated_at = now()
  WHERE id = p_campaign_id AND user_id = auth.uid();
END;
$$;

-- 7) Grant execute on functions to authenticated users
REVOKE ALL ON FUNCTION public.get_user_metrics FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_metrics TO anon, authenticated;
REVOKE ALL ON FUNCTION public.update_campaign_status FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_campaign_status TO authenticated;
REVOKE ALL ON FUNCTION public.update_campaign_budget FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_campaign_budget TO authenticated;

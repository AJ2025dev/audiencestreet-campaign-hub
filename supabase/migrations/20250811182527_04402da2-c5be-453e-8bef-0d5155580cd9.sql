-- Replace SECURITY DEFINER functions with default invoker to satisfy linter
DROP FUNCTION IF EXISTS public.update_campaign_status(uuid, text);
CREATE OR REPLACE FUNCTION public.update_campaign_status(p_campaign_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
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

DROP FUNCTION IF EXISTS public.get_current_user_id();
-- Phase 1: Fix the security definer view issue by replacing insecure view with secure function

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.user_metrics_summary;

-- Create a security definer function that respects user access controls
CREATE OR REPLACE FUNCTION public.get_user_metrics_summary(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  user_id uuid,
  total_impressions bigint,
  total_clicks bigint, 
  total_spend_cents numeric,
  ctr_percent numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  -- Only allow users to see their own metrics or admins to see any metrics
  WITH access_check AS (
    SELECT CASE 
      WHEN target_user_id = auth.uid() THEN true
      WHEN get_user_role(auth.uid()) = 'admin' THEN true
      ELSE false
    END AS has_access
  )
  SELECT 
    c.user_id,
    COALESCE(SUM(it.impression_count), 0)::bigint AS total_impressions,
    COALESCE(COUNT(cl.id), 0)::bigint AS total_clicks,
    COALESCE(SUM(it.spend_cents), 0)::numeric AS total_spend_cents,
    CASE 
      WHEN COALESCE(SUM(it.impression_count), 0) > 0 
      THEN ROUND((COUNT(cl.id)::numeric / SUM(it.impression_count)::numeric) * 100, 2)
      ELSE 0::numeric
    END AS ctr_percent
  FROM campaigns c
  LEFT JOIN impression_tracking it ON it.campaign_id = c.id
  LEFT JOIN clicks cl ON cl.campaign_id = c.id
  CROSS JOIN access_check ac
  WHERE ac.has_access = true 
    AND c.user_id = target_user_id
  GROUP BY c.user_id;
$$;

-- Create a simpler version for the existing get_user_metrics function to use
CREATE OR REPLACE FUNCTION public.get_user_metrics()
RETURNS TABLE(
  user_id uuid,
  total_spend_cents numeric,
  ctr_percent numeric,
  total_impressions bigint,
  total_clicks bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT user_id, total_spend_cents, ctr_percent, total_impressions, total_clicks
  FROM public.get_user_metrics_summary(auth.uid());
$$;

-- Phase 2: Add security logging function for monitoring
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id uuid DEFAULT auth.uid(),
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log security events (in production, this would go to a dedicated security_logs table)
  RAISE LOG 'SECURITY_EVENT: % - User: % - Details: %', event_type, user_id, details;
END;
$$;
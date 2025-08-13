-- Adjust get_user_metrics to use SECURITY INVOKER (default) to satisfy linter
CREATE OR REPLACE FUNCTION public.get_user_metrics()
RETURNS TABLE (
  user_id uuid,
  total_spend_cents numeric,
  ctr_percent numeric,
  total_impressions bigint,
  total_clicks bigint
)
LANGUAGE sql
STABLE
SET search_path TO ''
AS $$
  SELECT user_id, total_spend_cents, ctr_percent, total_impressions, total_clicks
  FROM public.user_metrics_summary
  WHERE user_id = auth.uid();
$$;
-- Create a function to get daily performance metrics for charts
CREATE OR REPLACE FUNCTION public.get_daily_performance_metrics(days_back integer DEFAULT 30)
RETURNS TABLE (
  date date,
  impressions bigint,
  clicks bigint,
  spend_cents bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (days_back || ' days')::interval,
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date
  ),
  user_campaigns AS (
    SELECT id as campaign_id
    FROM public.campaigns
    WHERE user_id = auth.uid()
  ),
  daily_impressions AS (
    SELECT 
      DATE(it.created_at) AS date,
      COALESCE(SUM(it.impression_count), 0)::bigint AS impressions,
      COALESCE(SUM(it.spend_cents), 0)::bigint AS spend_cents
    FROM user_campaigns uc
    JOIN public.impression_tracking it ON it.campaign_id = uc.campaign_id
    WHERE DATE(it.created_at) >= CURRENT_DATE - (days_back || ' days')::interval
    GROUP BY DATE(it.created_at)
  ),
  daily_clicks AS (
    SELECT 
      DATE(cl.created_at) AS date,
      COUNT(*)::bigint AS clicks
    FROM user_campaigns uc
    JOIN public.clicks cl ON cl.campaign_id = uc.campaign_id
    WHERE DATE(cl.created_at) >= CURRENT_DATE - (days_back || ' days')::interval
    GROUP BY DATE(cl.created_at)
  )
  SELECT 
    ds.date,
    COALESCE(di.impressions, 0)::bigint AS impressions,
    COALESCE(dc.clicks, 0)::bigint AS clicks,
    COALESCE(di.spend_cents, 0)::bigint AS spend_cents
  FROM date_series ds
  LEFT JOIN daily_impressions di ON ds.date = di.date
  LEFT JOIN daily_clicks dc ON ds.date = dc.date
  ORDER BY ds.date;
$$;
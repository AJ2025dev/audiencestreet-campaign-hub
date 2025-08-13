-- Fix security issues: Add search_path to functions for security

-- Update function to include search_path for security
CREATE OR REPLACE FUNCTION public.get_campaign_spend_metrics(p_campaign_id uuid)
RETURNS TABLE(
  campaign_id uuid,
  total_spend_cents bigint,
  spend_today_cents bigint,
  average_hourly_spend_cents numeric,
  budget_utilization_percent numeric,
  daily_budget_utilization_percent numeric,
  estimated_completion_hours numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p_campaign_id,
    COALESCE(SUM(it.spend_cents), 0) as total_spend_cents,
    COALESCE(SUM(CASE 
      WHEN DATE(it.created_at) = CURRENT_DATE 
      THEN it.spend_cents 
      ELSE 0 
    END), 0) as spend_today_cents,
    CASE 
      WHEN COUNT(DISTINCT DATE_TRUNC('hour', it.created_at)) > 0 
      THEN COALESCE(SUM(it.spend_cents), 0) / COUNT(DISTINCT DATE_TRUNC('hour', it.created_at))::numeric 
      ELSE 0 
    END as average_hourly_spend_cents,
    CASE 
      WHEN c.budget > 0 
      THEN (COALESCE(SUM(it.spend_cents), 0) / (c.budget * 100.0)) * 100 
      ELSE 0 
    END as budget_utilization_percent,
    CASE 
      WHEN c.daily_budget > 0 
      THEN (COALESCE(SUM(CASE 
        WHEN DATE(it.created_at) = CURRENT_DATE 
        THEN it.spend_cents 
        ELSE 0 
      END), 0) / (c.daily_budget * 100.0)) * 100 
      ELSE NULL 
    END as daily_budget_utilization_percent,
    CASE 
      WHEN c.budget > 0 AND COALESCE(SUM(it.spend_cents), 0) > 0 
      THEN ((c.budget * 100) - COALESCE(SUM(it.spend_cents), 0)) / 
           GREATEST(1, COALESCE(SUM(it.spend_cents), 0) / 
           GREATEST(1, COUNT(DISTINCT DATE_TRUNC('hour', it.created_at))))
      ELSE NULL 
    END as estimated_completion_hours
  FROM campaigns c
  LEFT JOIN impression_tracking it ON it.campaign_id = c.id
  WHERE c.id = p_campaign_id
  GROUP BY c.id, c.budget, c.daily_budget;
END;
$$;

-- Update function to include search_path for security
CREATE OR REPLACE FUNCTION public.auto_pause_overspending_campaigns()
RETURNS TABLE(
  campaign_id uuid,
  campaign_name text,
  action_taken text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Pause campaigns that have exceeded their total budget by 10%
  UPDATE campaigns SET status = 'paused', updated_at = now()
  WHERE id IN (
    SELECT c.id 
    FROM campaigns c
    LEFT JOIN impression_tracking it ON it.campaign_id = c.id
    WHERE c.status = 'active'
    AND c.budget > 0
    AND COALESCE((SELECT SUM(spend_cents) FROM impression_tracking WHERE campaign_id = c.id), 0) 
        > (c.budget * 100 * 1.1) -- 110% of budget
  );

  -- Return information about paused campaigns
  RETURN QUERY
  SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    'auto_paused_budget_exceeded'::text as action_taken
  FROM campaigns c
  LEFT JOIN impression_tracking it ON it.campaign_id = c.id
  WHERE c.status = 'paused'
  AND c.updated_at > (now() - interval '1 minute')
  AND COALESCE((SELECT SUM(spend_cents) FROM impression_tracking WHERE campaign_id = c.id), 0) 
      > (c.budget * 100 * 1.1);
END;
$$;

-- Update function to include search_path for security
CREATE OR REPLACE FUNCTION public.get_campaign_alerts(p_user_id uuid)
RETURNS TABLE(
  campaign_id uuid,
  campaign_name text,
  alert_type text,
  severity text,
  message text,
  spend_amount numeric,
  budget_amount numeric,
  utilization_percent numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH campaign_spend AS (
    SELECT 
      c.id,
      c.name,
      c.user_id,
      c.budget,
      c.daily_budget,
      c.status,
      COALESCE(SUM(it.spend_cents), 0) / 100.0 as total_spend,
      COALESCE(SUM(CASE 
        WHEN DATE(it.created_at) = CURRENT_DATE 
        THEN it.spend_cents 
        ELSE 0 
      END), 0) / 100.0 as today_spend
    FROM campaigns c
    LEFT JOIN impression_tracking it ON it.campaign_id = c.id
    WHERE c.user_id = p_user_id
    AND c.status IN ('active', 'paused')
    GROUP BY c.id, c.name, c.user_id, c.budget, c.daily_budget, c.status
  )
  SELECT 
    cs.id as campaign_id,
    cs.name as campaign_name,
    CASE 
      WHEN cs.total_spend > cs.budget THEN 'budget_exceeded'
      WHEN cs.total_spend > (cs.budget * 0.9) THEN 'budget_warning'
      WHEN cs.daily_budget IS NOT NULL AND cs.today_spend > cs.daily_budget THEN 'daily_budget_exceeded'
      WHEN cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.9) THEN 'daily_budget_warning'
      ELSE 'pacing_normal'
    END as alert_type,
    CASE 
      WHEN cs.total_spend > cs.budget OR (cs.daily_budget IS NOT NULL AND cs.today_spend > cs.daily_budget) THEN 'critical'
      WHEN cs.total_spend > (cs.budget * 0.95) OR (cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.95)) THEN 'high'
      WHEN cs.total_spend > (cs.budget * 0.9) OR (cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.9)) THEN 'medium'
      ELSE 'low'
    END as severity,
    CASE 
      WHEN cs.total_spend > cs.budget THEN 
        'Campaign has exceeded total budget by $' || ROUND(cs.total_spend - cs.budget, 2)
      WHEN cs.daily_budget IS NOT NULL AND cs.today_spend > cs.daily_budget THEN 
        'Campaign has exceeded daily budget by $' || ROUND(cs.today_spend - cs.daily_budget, 2)
      WHEN cs.total_spend > (cs.budget * 0.9) THEN 
        'Campaign approaching budget limit (' || ROUND((cs.total_spend / cs.budget) * 100, 0) || '%)'
      WHEN cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.9) THEN 
        'Campaign approaching daily limit (' || ROUND((cs.today_spend / cs.daily_budget) * 100, 0) || '%)'
      ELSE 'Campaign spending within limits'
    END as message,
    cs.total_spend as spend_amount,
    cs.budget as budget_amount,
    ROUND((cs.total_spend / GREATEST(cs.budget, 1)) * 100, 2) as utilization_percent
  FROM campaign_spend cs
  WHERE (
    cs.total_spend > (cs.budget * 0.8) OR 
    (cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.8))
  )
  ORDER BY 
    CASE 
      WHEN cs.total_spend > cs.budget OR (cs.daily_budget IS NOT NULL AND cs.today_spend > cs.daily_budget) THEN 1
      WHEN cs.total_spend > (cs.budget * 0.95) OR (cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.95)) THEN 2
      WHEN cs.total_spend > (cs.budget * 0.9) OR (cs.daily_budget IS NOT NULL AND cs.today_spend > (cs.daily_budget * 0.9)) THEN 3
      ELSE 4
    END,
    cs.total_spend DESC;
END;
$$;
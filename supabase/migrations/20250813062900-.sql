-- Harden role assignment: never allow admin via signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_role text;
  v_company text;
BEGIN
  -- Sanitize incoming role; only allow 'advertiser' or 'agency'
  v_role := lower(coalesce(NEW.raw_user_meta_data ->> 'role', 'advertiser'));
  IF v_role NOT IN ('advertiser', 'agency') THEN
    v_role := 'advertiser';
  END IF;

  v_company := coalesce(NEW.raw_user_meta_data ->> 'company_name', 'Unknown Company');

  INSERT INTO public.profiles (user_id, role, company_name, contact_email)
  VALUES (
    NEW.id,
    v_role::public.user_role,
    v_company,
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Secure access path to user_metrics via RPC instead of open view
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
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT user_id, total_spend_cents, ctr_percent, total_impressions, total_clicks
  FROM public.user_metrics_summary
  WHERE user_id = auth.uid();
$$;
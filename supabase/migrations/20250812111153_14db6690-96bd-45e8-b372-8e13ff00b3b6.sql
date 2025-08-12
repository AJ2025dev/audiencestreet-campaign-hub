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

-- Enable RLS on aggregated metrics table and restrict to owner
ALTER TABLE public.user_metrics_summary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own metrics" ON public.user_metrics_summary;
CREATE POLICY "Users can view their own metrics"
ON public.user_metrics_summary
FOR SELECT
USING (auth.uid() = user_id);

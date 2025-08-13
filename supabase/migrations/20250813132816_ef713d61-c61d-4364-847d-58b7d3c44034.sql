-- Phase 1: Critical Data Protection - Secure User Metrics Data
-- Add RLS policies to user_metrics_summary table to prevent data exposure

-- Enable Row Level Security on user_metrics_summary
ALTER TABLE public.user_metrics_summary ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own metrics
CREATE POLICY "Users can only view their own metrics"
ON public.user_metrics_summary
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for admins to view all metrics (for admin dashboard)
CREATE POLICY "Admins can view all user metrics"  
ON public.user_metrics_summary
FOR SELECT
USING (get_user_role(auth.uid()) = 'admin');

-- Phase 2: Fix Auth Settings (these will need to be configured in Supabase dashboard)
-- Note: OTP expiry and leaked password protection need to be configured via Supabase dashboard

-- Phase 3: Add security logging function for monitoring
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
  -- In a production environment, you would log to a security_logs table
  -- For now, we'll use a simple approach that can be extended later
  RAISE LOG 'SECURITY_EVENT: % - User: % - Details: %', event_type, user_id, details;
END;
$$;
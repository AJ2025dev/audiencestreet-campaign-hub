-- Fix function security by setting search path
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = check_user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';
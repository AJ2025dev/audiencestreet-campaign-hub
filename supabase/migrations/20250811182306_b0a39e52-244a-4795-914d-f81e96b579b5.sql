-- Remove security definer function to satisfy linter; rely on view + table RLS instead
DROP FUNCTION IF EXISTS public.get_user_metrics();

-- Note: Query user_metrics_summary directly with a WHERE user_id = auth.uid() from the client.
-- Underlying table RLS will be enforced, so no SECURITY DEFINER is needed.

-- Update aj@theaudiencestreet.com to admin role
-- First, check if this user exists and update their role
UPDATE public.profiles 
SET role = 'admin'
WHERE contact_email = 'aj@theaudiencestreet.com';

-- Remove admin role from admin@dsp.com if it exists
UPDATE public.profiles 
SET role = 'advertiser' 
WHERE contact_email = 'admin@dsp.com';
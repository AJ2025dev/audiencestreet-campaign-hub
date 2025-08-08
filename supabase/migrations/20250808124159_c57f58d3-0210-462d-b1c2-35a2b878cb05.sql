-- Create table for platform API credentials
CREATE TABLE public.platform_credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform IN ('meta', 'google')),
  api_key text,
  account_id text,
  merchant_id text,
  access_token text,
  client_id text,
  client_secret text,
  refresh_token text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable Row Level Security
ALTER TABLE public.platform_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for platform credentials
CREATE POLICY "Users can manage their own platform credentials"
ON public.platform_credentials
FOR ALL
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_platform_credentials_updated_at
BEFORE UPDATE ON public.platform_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
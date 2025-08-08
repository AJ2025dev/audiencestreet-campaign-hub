-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('agency', 'advertiser');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'advertiser',
  company_name TEXT NOT NULL,
  contact_email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create allowlists/blocklists table
CREATE TABLE public.domain_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  list_type TEXT NOT NULL CHECK (list_type IN ('allowlist', 'blocklist')),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('domain', 'site', 'app', 'ip')),
  value TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create frequency caps table
CREATE TABLE public.frequency_caps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cap_type TEXT NOT NULL CHECK (cap_type IN ('daily', 'weekly', 'monthly', 'lifetime')),
  max_impressions INTEGER NOT NULL,
  time_window_hours INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create impression tracking table for frequency capping
CREATE TABLE public.impression_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL,
  user_identifier TEXT NOT NULL, -- Could be IP, cookie, device ID, etc.
  impression_count INTEGER DEFAULT 1,
  first_impression TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_impression TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, user_identifier)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frequency_caps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impression_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for domain_lists
CREATE POLICY "Users can manage their own domain lists" ON public.domain_lists
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for frequency_caps
CREATE POLICY "Users can manage their own frequency caps" ON public.frequency_caps
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for impression_tracking (more permissive for tracking)
CREATE POLICY "Allow impression tracking" ON public.impression_tracking
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domain_lists_updated_at
  BEFORE UPDATE ON public.domain_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_frequency_caps_updated_at
  BEFORE UPDATE ON public.frequency_caps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, company_name, contact_email)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'advertiser'),
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Unknown Company'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_domain_lists_user_id ON public.domain_lists(user_id);
CREATE INDEX idx_domain_lists_type ON public.domain_lists(list_type, entry_type);
CREATE INDEX idx_frequency_caps_campaign ON public.frequency_caps(campaign_id);
CREATE INDEX idx_impression_tracking_campaign_user ON public.impression_tracking(campaign_id, user_identifier);
CREATE INDEX idx_impression_tracking_timestamp ON public.impression_tracking(last_impression);
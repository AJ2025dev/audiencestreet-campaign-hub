-- Create commission structure table
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('agency_commission', 'admin_profit')),
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  applies_to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = check_user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Admin can manage all commissions
CREATE POLICY "Admins can manage all commissions"
ON public.commissions
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Agencies can manage their own commission settings
CREATE POLICY "Agencies can manage their own commissions"
ON public.commissions
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id AND 
  public.get_user_role(auth.uid()) = 'agency'
);

-- Create agency-advertiser relationships table
CREATE TABLE public.agency_advertisers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  advertiser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(agency_id, advertiser_id)
);

-- Enable RLS
ALTER TABLE public.agency_advertisers ENABLE ROW LEVEL SECURITY;

-- Admin can see all relationships
CREATE POLICY "Admins can manage all agency-advertiser relationships"
ON public.agency_advertisers
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Agencies can manage their relationships
CREATE POLICY "Agencies can manage their advertiser relationships"
ON public.agency_advertisers
FOR ALL
TO authenticated
USING (
  auth.uid() = agency_id AND
  public.get_user_role(auth.uid()) = 'agency'
);

-- Advertisers can see their agency relationships
CREATE POLICY "Advertisers can view their agency relationships"
ON public.agency_advertisers
FOR SELECT
TO authenticated
USING (
  auth.uid() = advertiser_id AND
  public.get_user_role(auth.uid()) = 'advertiser'
);

-- Create campaigns table with targeting integration
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(12,2) NOT NULL CHECK (budget > 0),
  daily_budget DECIMAL(12,2),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'completed', 'cancelled')),
  targeting_config JSONB NOT NULL DEFAULT '{}',
  frequency_caps JSONB DEFAULT '[]',
  domain_lists JSONB DEFAULT '{"allowlists": [], "blocklists": []}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Admin can manage all campaigns
CREATE POLICY "Admins can manage all campaigns"
ON public.campaigns
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Users can manage their own campaigns
CREATE POLICY "Users can manage their own campaigns"
ON public.campaigns
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Agencies can manage campaigns for their advertisers
CREATE POLICY "Agencies can manage campaigns for their advertisers"
ON public.campaigns
FOR ALL
TO authenticated
USING (
  auth.uid() = agency_id AND
  EXISTS (
    SELECT 1 FROM public.agency_advertisers 
    WHERE agency_advertisers.agency_id = auth.uid() 
    AND agency_advertisers.advertiser_id = campaigns.user_id
    AND agency_advertisers.is_active = true
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_commissions_updated_at
BEFORE UPDATE ON public.commissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Add campaign linking to domain lists
ALTER TABLE domain_lists 
ADD COLUMN campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
ADD COLUMN is_global BOOLEAN DEFAULT false;

-- Create PMP deals table
CREATE TABLE pmp_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  deal_name TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  dsp_name TEXT NOT NULL,
  floor_price NUMERIC,
  currency TEXT DEFAULT 'USD',
  deal_type TEXT NOT NULL DEFAULT 'fixed_price', -- fixed_price, first_price, second_price
  priority INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, expired
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  targeting_config JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for PMP deals
ALTER TABLE pmp_deals ENABLE ROW LEVEL SECURITY;

-- Create policies for PMP deals
CREATE POLICY "Users can manage their own PMP deals" 
ON pmp_deals 
FOR ALL 
USING (auth.uid() = user_id);

-- Create Meta Ads campaigns table
CREATE TABLE meta_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meta_campaign_id TEXT,
  campaign_name TEXT NOT NULL,
  objective TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paused',
  daily_budget NUMERIC,
  lifetime_budget NUMERIC,
  bid_strategy TEXT,
  targeting_config JSONB DEFAULT '{}',
  creative_config JSONB DEFAULT '{}',
  margin_percentage NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for Meta campaigns
ALTER TABLE meta_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for Meta campaigns
CREATE POLICY "Users can manage their own Meta campaigns" 
ON meta_campaigns 
FOR ALL 
USING (auth.uid() = user_id);

-- Create Google Ads campaigns table
CREATE TABLE google_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  google_campaign_id TEXT,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paused',
  daily_budget NUMERIC,
  bid_strategy TEXT,
  targeting_config JSONB DEFAULT '{}',
  creative_config JSONB DEFAULT '{}',
  margin_percentage NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for Google campaigns
ALTER TABLE google_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for Google campaigns
CREATE POLICY "Users can manage their own Google campaigns" 
ON google_campaigns 
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_pmp_deals_updated_at
BEFORE UPDATE ON pmp_deals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_campaigns_updated_at
BEFORE UPDATE ON meta_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_google_campaigns_updated_at
BEFORE UPDATE ON google_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
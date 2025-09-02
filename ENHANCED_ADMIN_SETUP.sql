-- Enhanced Admin Dashboard Database Setup
-- Run this in Supabase SQL Editor to add missing tables and features

-- 1. Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(15,2) DEFAULT 50000.00,
ADD COLUMN IF NOT EXISTS spending_limit DECIMAL(15,2) DEFAULT 10000.00,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create budget_controls table
CREATE TABLE IF NOT EXISTS public.budget_controls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_limit DECIMAL(15,2) DEFAULT 0,
    monthly_limit DECIMAL(15,2) DEFAULT 0,
    total_limit DECIMAL(15,2) DEFAULT 0,
    current_daily_spend DECIMAL(15,2) DEFAULT 0,
    current_monthly_spend DECIMAL(15,2) DEFAULT 0,
    current_total_spend DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. Create api_configurations table
CREATE TABLE IF NOT EXISTS public.api_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_name TEXT NOT NULL,
    api_key_encrypted TEXT, -- Store encrypted API keys
    is_active BOOLEAN DEFAULT false,
    last_tested TIMESTAMPTZ,
    status TEXT DEFAULT 'untested' CHECK (status IN ('connected', 'error', 'untested')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(api_name)
);

-- 4. Enhance commissions table (if needed)
ALTER TABLE public.commissions 
ADD COLUMN IF NOT EXISTS applies_to_campaigns BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS minimum_spend DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS maximum_spend DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS effective_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS expiry_date DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. Create user_activity_logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'login', 'campaign_created', 'budget_exceeded', etc.
    activity_description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create campaign_performance table (for enhanced reporting)
CREATE TABLE IF NOT EXISTS public.campaign_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    spend DECIMAL(15,2) DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    cpm DECIMAL(10,2),
    cpc DECIMAL(10,2),
    cpa DECIMAL(10,2),
    roas DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- 7. Enable Row Level Security for new tables
ALTER TABLE public.budget_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_performance ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for budget_controls
CREATE POLICY "Admin can view all budget controls" ON public.budget_controls
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin can manage all budget controls" ON public.budget_controls
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own budget controls" ON public.budget_controls
    FOR SELECT USING (user_id = auth.uid());

-- 9. Create policies for api_configurations (admin only)
CREATE POLICY "Only admin can manage API configurations" ON public.api_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 10. Create policies for user_activity_logs
CREATE POLICY "Admin can view all activity logs" ON public.user_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own activity logs" ON public.user_activity_logs
    FOR SELECT USING (user_id = auth.uid());

-- 11. Create policies for campaign_performance
CREATE POLICY "Admin can view all campaign performance" ON public.campaign_performance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own campaign performance" ON public.campaign_performance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns c 
            JOIN public.profiles p ON p.user_id = auth.uid()
            WHERE c.id = campaign_id 
            AND (c.user_id = auth.uid() OR (p.role = 'agency' AND c.agency_id = auth.uid()))
        )
    );

-- 12. Create functions for automated budget tracking
CREATE OR REPLACE FUNCTION update_budget_spend()
RETURNS TRIGGER AS $$
BEGIN
    -- Update daily and monthly spend when campaign spend changes
    IF TG_OP = 'UPDATE' AND (OLD.budget IS DISTINCT FROM NEW.budget) THEN
        UPDATE budget_controls 
        SET 
            current_daily_spend = current_daily_spend + (NEW.budget - OLD.budget),
            current_monthly_spend = current_monthly_spend + (NEW.budget - OLD.budget),
            current_total_spend = current_total_spend + (NEW.budget - OLD.budget),
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create trigger for budget tracking
DROP TRIGGER IF EXISTS budget_spend_update_trigger ON campaigns;
CREATE TRIGGER budget_spend_update_trigger
    AFTER UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_spend();

-- 14. Create function to log user activities
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity_logs (user_id, activity_type, activity_description, metadata)
    VALUES (p_user_id, p_activity_type, p_description, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- 15. Insert default API configurations
INSERT INTO api_configurations (api_name, is_active, status) 
VALUES 
    ('OPENAI_API_KEY', false, 'untested'),
    ('EQUATIV_API_KEY', false, 'untested'),
    ('MINIMAX_API_KEY', false, 'untested')
ON CONFLICT (api_name) DO NOTHING;

-- 16. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_budget_controls_user_id ON budget_controls(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign_id ON campaign_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_date ON campaign_performance(date);

-- 17. Create view for admin dashboard metrics
CREATE OR REPLACE VIEW admin_dashboard_metrics AS
SELECT 
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM profiles WHERE role = 'agency') as total_agencies,
    (SELECT COUNT(*) FROM profiles WHERE role = 'advertiser') as total_advertisers,
    (SELECT COUNT(*) FROM campaigns WHERE status = 'active') as active_campaigns,
    (SELECT COALESCE(SUM(budget), 0) FROM campaigns) as total_platform_revenue,
    (SELECT COUNT(*) FROM api_configurations WHERE is_active = true) as active_apis,
    (SELECT COALESCE(AVG(percentage), 0) FROM commissions WHERE commission_type = 'admin_profit' AND is_active = true) as avg_admin_margin;

-- Grant permissions to authenticated users
GRANT SELECT ON admin_dashboard_metrics TO authenticated;

-- 18. Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_campaigns', COALESCE((SELECT COUNT(*) FROM campaigns WHERE user_id = p_user_id), 0),
        'active_campaigns', COALESCE((SELECT COUNT(*) FROM campaigns WHERE user_id = p_user_id AND status = 'active'), 0),
        'total_spend', COALESCE((SELECT SUM(budget) FROM campaigns WHERE user_id = p_user_id), 0),
        'current_month_spend', COALESCE((SELECT current_monthly_spend FROM budget_controls WHERE user_id = p_user_id), 0),
        'budget_utilization', COALESCE((
            SELECT CASE 
                WHEN monthly_limit > 0 THEN (current_monthly_spend / monthly_limit) * 100 
                ELSE 0 
            END 
            FROM budget_controls WHERE user_id = p_user_id
        ), 0)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated;

-- Done! Your enhanced admin dashboard database structure is now ready.
-- Next steps:
-- 1. Deploy the enhanced admin component
-- 2. Test all new functionality
-- 3. Configure API keys through the admin interface
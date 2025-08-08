-- Insert sample data for testing domain lists, app lists, and publisher lists
-- Note: Using a sample user ID - replace with actual user ID in production

-- Sample domain entries
INSERT INTO public.domain_lists (entry_type, list_type, value, description, is_active, is_global, user_id) VALUES
('domain', 'allowlist', 'example.com', 'Example domain for testing', true, true, '00000000-0000-0000-0000-000000000000'),
('domain', 'blocklist', 'spam-site.com', 'Known spam domain', true, true, '00000000-0000-0000-0000-000000000000'),
('domain', 'allowlist', 'trusted-news.com', 'Trusted news source', true, false, '00000000-0000-0000-0000-000000000000');

-- Sample app entries
INSERT INTO public.domain_lists (entry_type, list_type, value, description, is_active, is_global, user_id) VALUES
('app', 'allowlist', 'com.example.news', 'News application', true, true, '00000000-0000-0000-0000-000000000000'),
('app', 'blocklist', 'com.badapp.malware', 'Known malware app', true, true, '00000000-0000-0000-0000-000000000000'),
('app', 'allowlist', 'com.social.media', 'Popular social media app', true, false, '00000000-0000-0000-0000-000000000000');

-- Sample publisher/site entries
INSERT INTO public.domain_lists (entry_type, list_type, value, description, is_active, is_global, user_id) VALUES
('site', 'allowlist', 'premium-publisher.com', 'Premium publisher site', true, true, '00000000-0000-0000-0000-000000000000'),
('site', 'blocklist', 'low-quality-site.com', 'Low quality content site', true, true, '00000000-0000-0000-0000-000000000000'),
('site', 'allowlist', 'tech-news.com', 'Technology news publisher', true, false, '00000000-0000-0000-0000-000000000000');
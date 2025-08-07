-- Create table for list uploads (CSV/XLS files)
CREATE TABLE public.list_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'csv' or 'xls'
  list_type TEXT NOT NULL, -- 'allowlist' or 'blocklist'
  entry_type TEXT NOT NULL, -- 'domain', 'app', or 'site'
  campaign_id UUID REFERENCES public.campaigns(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  total_entries INTEGER DEFAULT 0,
  processed_entries INTEGER DEFAULT 0,
  failed_entries INTEGER DEFAULT 0,
  error_message TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.list_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for list uploads
CREATE POLICY "Users can manage their own list uploads" 
ON public.list_uploads 
FOR ALL 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_list_uploads_user_id ON public.list_uploads(user_id);
CREATE INDEX idx_list_uploads_campaign_id ON public.list_uploads(campaign_id);

-- Create trigger for updated_at
CREATE TRIGGER update_list_uploads_updated_at
BEFORE UPDATE ON public.list_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
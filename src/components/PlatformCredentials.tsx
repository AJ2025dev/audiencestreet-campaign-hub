import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Eye, EyeOff, Settings } from 'lucide-react';

interface PlatformCredential {
  id: string;
  platform: string;
  api_key?: string;
  account_id?: string;
  merchant_id?: string;
  access_token?: string;
  client_id?: string;
  client_secret?: string;
  refresh_token?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PlatformCredentialsProps {
  platform: 'meta' | 'google';
  title: string;
}

export default function PlatformCredentials({ platform, title }: PlatformCredentialsProps) {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<PlatformCredential | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState(false);
  
  const [formData, setFormData] = useState({
    api_key: '',
    account_id: '',
    merchant_id: '',
    access_token: '',
    client_id: '',
    client_secret: '',
    refresh_token: '',
  });

  useEffect(() => {
    if (user) {
      fetchCredentials();
    }
  }, [user, platform]);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_credentials')
        .select('*')
        .eq('platform', platform)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCredentials(data);
        setFormData({
          api_key: data.api_key || '',
          account_id: data.account_id || '',
          merchant_id: data.merchant_id || '',
          access_token: data.access_token || '',
          client_id: data.client_id || '',
          client_secret: data.client_secret || '',
          refresh_token: data.refresh_token || '',
        });
      }
    } catch (error) {
      console.error('Error fetching platform credentials:', error);
      toast.error('Failed to load platform credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const credentialData = {
        user_id: user.id,
        platform,
        ...formData,
        is_active: true,
      };

      if (credentials) {
        const { error } = await supabase
          .from('platform_credentials')
          .update(credentialData)
          .eq('id', credentials.id);

        if (error) throw error;
        toast.success(`${title} credentials updated successfully`);
      } else {
        const { error } = await supabase
          .from('platform_credentials')
          .insert(credentialData);

        if (error) throw error;
        toast.success(`${title} credentials added successfully`);
      }

      fetchCredentials();
    } catch (error) {
      console.error('Error saving platform credentials:', error);
      toast.error('Failed to save platform credentials');
    }
  };

  const maskValue = (value: string) => {
    if (!value || showSecrets) return value;
    return value.length > 8 ? `${value.substring(0, 4)}${'*'.repeat(value.length - 8)}${value.substring(value.length - 4)}` : '*'.repeat(value.length);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {title} Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {title} Integration
          </CardTitle>
          {credentials && (
            <Badge className="bg-success text-success-foreground">
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${platform}_api_key`}>API Key</Label>
              <div className="relative">
                <Input
                  id={`${platform}_api_key`}
                  type={showSecrets ? 'text' : 'password'}
                  value={maskValue(formData.api_key)}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter API key"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${platform}_account_id`}>Account ID</Label>
              <Input
                id={`${platform}_account_id`}
                value={formData.account_id}
                onChange={(e) => setFormData(prev => ({ ...prev, account_id: e.target.value }))}
                placeholder="Enter account ID"
              />
            </div>
          </div>

          {platform === 'google' && (
            <div className="space-y-2">
              <Label htmlFor="merchant_id">Merchant ID (for Shopping campaigns)</Label>
              <Input
                id="merchant_id"
                value={formData.merchant_id}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant_id: e.target.value }))}
                placeholder="Enter merchant ID"
              />
            </div>
          )}

          {platform === 'meta' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="access_token">Access Token</Label>
                <Input
                  id="access_token"
                  type={showSecrets ? 'text' : 'password'}
                  value={maskValue(formData.access_token)}
                  onChange={(e) => setFormData(prev => ({ ...prev, access_token: e.target.value }))}
                  placeholder="Enter access token"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_id">Client ID</Label>
                <Input
                  id="client_id"
                  value={formData.client_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                  placeholder="Enter client ID"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showSecrets ? 'Hide' : 'Show'} Secrets
            </Button>
            
            <Button type="submit">
              {credentials ? 'Update' : 'Save'} Credentials
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
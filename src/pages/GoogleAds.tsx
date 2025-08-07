import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Trash2, Plus, Edit, Play, Pause, Search } from 'lucide-react';

interface GoogleCampaign {
  id: string;
  google_campaign_id?: string;
  campaign_name: string;
  campaign_type: string;
  status: string;
  daily_budget?: number;
  bid_strategy?: string;
  margin_percentage: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

const CAMPAIGN_TYPES = [
  'SEARCH',
  'DISPLAY',
  'SHOPPING',
  'VIDEO',
  'DISCOVERY',
  'APP',
  'SMART',
  'PERFORMANCE_MAX',
];

const BID_STRATEGIES = [
  'MANUAL_CPC',
  'ENHANCED_CPC',
  'MAXIMIZE_CLICKS',
  'MAXIMIZE_CONVERSIONS',
  'TARGET_CPA',
  'TARGET_ROAS',
  'MAXIMIZE_CONVERSION_VALUE',
];

export default function GoogleAds() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<GoogleCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<GoogleCampaign | null>(null);

  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: '',
    daily_budget: '',
    bid_strategy: '',
    margin_percentage: '10',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('google_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data as GoogleCampaign[]) || []);
    } catch (error) {
      console.error('Error fetching Google campaigns:', error);
      toast.error('Failed to load Google campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const campaignData = {
        ...formData,
        daily_budget: formData.daily_budget ? parseFloat(formData.daily_budget) : null,
        margin_percentage: parseFloat(formData.margin_percentage) || 0,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('google_campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        toast.success('Google campaign updated successfully');
      } else {
        const { error } = await supabase
          .from('google_campaigns')
          .insert({
            ...campaignData,
            user_id: user.id,
            status: 'paused',
          });

        if (error) throw error;
        toast.success('Google campaign created successfully');
      }

      setIsDialogOpen(false);
      setEditingCampaign(null);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving Google campaign:', error);
      toast.error('Failed to save Google campaign');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('google_campaigns')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`);
      fetchCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      toast.error('Failed to update campaign status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('google_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Google campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const openEditDialog = (campaign: GoogleCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      campaign_name: campaign.campaign_name,
      campaign_type: campaign.campaign_type,
      daily_budget: campaign.daily_budget?.toString() || '',
      bid_strategy: campaign.bid_strategy || '',
      margin_percentage: campaign.margin_percentage.toString(),
      start_date: campaign.start_date ? campaign.start_date.split('T')[0] : '',
      end_date: campaign.end_date ? campaign.end_date.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      campaign_name: '',
      campaign_type: '',
      daily_budget: '',
      bid_strategy: '',
      margin_percentage: '10',
      start_date: '',
      end_date: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Google Ads</h1>
            <p className="text-muted-foreground">
              Manage your Google Ads campaigns with custom margins and bidding strategies
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCampaign(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Google Campaign' : 'Create New Google Campaign'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign_name">Campaign Name</Label>
                <Input
                  id="campaign_name"
                  value={formData.campaign_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign_name: e.target.value }))}
                  placeholder="Enter campaign name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign_type">Campaign Type</Label>
                  <Select 
                    value={formData.campaign_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPAIGN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bid_strategy">Bid Strategy</Label>
                  <Select 
                    value={formData.bid_strategy} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bid_strategy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bid strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {BID_STRATEGIES.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {strategy.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily_budget">Daily Budget ($)</Label>
                  <Input
                    id="daily_budget"
                    type="number"
                    step="0.01"
                    value={formData.daily_budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, daily_budget: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin_percentage">Margin (%)</Label>
                  <Input
                    id="margin_percentage"
                    type="number"
                    step="0.1"
                    value={formData.margin_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, margin_percentage: e.target.value }))}
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCampaign ? 'Update' : 'Create'} Campaign
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No Google campaigns found. Create your first campaign to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Daily Budget</TableHead>
                  <TableHead>Bid Strategy</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.campaign_type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.daily_budget ? `$${campaign.daily_budget.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {campaign.bid_strategy?.replace(/_/g, ' ') || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{campaign.margin_percentage}%</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusToggle(campaign.id, campaign.status)}
                        >
                          {campaign.status === 'active' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(campaign)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
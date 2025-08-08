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
import { Trash2, Plus, Edit, Play, Pause, Facebook } from 'lucide-react';
import PlatformCredentials from '@/components/PlatformCredentials';

interface MetaCampaign {
  id: string;
  meta_campaign_id?: string;
  campaign_name: string;
  objective: string;
  status: string;
  daily_budget?: number;
  lifetime_budget?: number;
  bid_strategy?: string;
  margin_percentage: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

const META_OBJECTIVES = [
  'AWARENESS',
  'REACH',
  'TRAFFIC',
  'APP_INSTALLS',
  'ENGAGEMENT',
  'VIDEO_VIEWS',
  'LEAD_GENERATION',
  'MESSAGES',
  'CONVERSIONS',
  'CATALOG_SALES',
  'STORE_TRAFFIC',
];

const BID_STRATEGIES = [
  'LOWEST_COST_WITHOUT_CAP',
  'LOWEST_COST_WITH_BID_CAP',
  'TARGET_COST',
  'COST_CAP',
];

export default function MetaAds() {
  const { user, profile } = useAuth();
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<MetaCampaign | null>(null);

  const [formData, setFormData] = useState({
    campaign_name: '',
    objective: '',
    daily_budget: '',
    lifetime_budget: '',
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
        .from('meta_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data as MetaCampaign[]) || []);
    } catch (error) {
      console.error('Error fetching Meta campaigns:', error);
      toast.error('Failed to load Meta campaigns');
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
        lifetime_budget: formData.lifetime_budget ? parseFloat(formData.lifetime_budget) : null,
        margin_percentage: parseFloat(formData.margin_percentage) || 0,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('meta_campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        toast.success('Meta campaign updated successfully');
      } else {
        const { error } = await supabase
          .from('meta_campaigns')
          .insert({
            ...campaignData,
            user_id: user.id,
            status: 'paused',
          });

        if (error) throw error;
        toast.success('Meta campaign created successfully');
      }

      setIsDialogOpen(false);
      setEditingCampaign(null);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving Meta campaign:', error);
      toast.error('Failed to save Meta campaign');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('meta_campaigns')
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
        .from('meta_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Meta campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const openEditDialog = (campaign: MetaCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      campaign_name: campaign.campaign_name,
      objective: campaign.objective,
      daily_budget: campaign.daily_budget?.toString() || '',
      lifetime_budget: campaign.lifetime_budget?.toString() || '',
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
      objective: '',
      daily_budget: '',
      lifetime_budget: '',
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
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Facebook className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Meta Ads</h1>
            <p className="text-muted-foreground">
              Manage your Facebook and Instagram advertising campaigns with custom margins
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
                {editingCampaign ? 'Edit Meta Campaign' : 'Create New Meta Campaign'}
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
                  <Label htmlFor="objective">Campaign Objective</Label>
                  <Select 
                    value={formData.objective} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      {META_OBJECTIVES.map((obj) => (
                        <SelectItem key={obj} value={obj}>{obj.replace('_', ' ')}</SelectItem>
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

              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="lifetime_budget">Lifetime Budget ($)</Label>
                  <Input
                    id="lifetime_budget"
                    type="number"
                    step="0.01"
                    value={formData.lifetime_budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, lifetime_budget: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
{profile?.role === 'admin' && (
                  <div className="space-y-2">
                    <Label htmlFor="margin_percentage">Margin (%) - Admin Only</Label>
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
                )}
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
          <CardTitle>Meta Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No Meta campaigns found. Create your first campaign to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Objective</TableHead>
                  <TableHead>Daily Budget</TableHead>
                  {profile?.role === 'admin' && <TableHead>Margin</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.objective.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.daily_budget ? `$${campaign.daily_budget.toFixed(2)}` : '-'}
                    </TableCell>
{profile?.role === 'admin' && (
                      <TableCell>
                        <Badge variant="secondary">{campaign.margin_percentage}%</Badge>
                      </TableCell>
                    )}
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

      <PlatformCredentials platform="meta" title="Meta" />
    </div>
  );
}
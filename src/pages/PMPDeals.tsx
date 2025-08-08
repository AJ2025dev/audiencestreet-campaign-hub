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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2, Plus, Edit, Play, Pause } from 'lucide-react';

interface PMPDeal {
  id: string;
  deal_name: string;
  deal_id: string;
  dsp_name: string;
  floor_price: number;
  currency: string;
  deal_type: string;
  priority: number;
  status: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at: string;
}

const DSP_OPTIONS = [
  'Google Ad Manager',
  'Amazon DSP',
  'The Trade Desk',
  'Adobe Advertising Cloud',
  'MediaMath',
  'Xandr',
  'DV360',
  'Other'
];

const DEAL_TYPES = [
  { value: 'fixed_price', label: 'Fixed Price' },
  { value: 'first_price', label: 'First Price Auction' },
  { value: 'second_price', label: 'Second Price Auction' }
];

export default function PMPDeals() {
  const { user } = useAuth();
  const [deals, setDeals] = useState<PMPDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<PMPDeal | null>(null);

  const [formData, setFormData] = useState({
    deal_name: '',
    deal_id: '',
    dsp_name: '',
    floor_price: '',
    currency: 'USD',
    deal_type: 'fixed_price',
    priority: '1',
    status: 'active',
    start_date: '',
    end_date: '',
    description: '',
    margin_percentage: '10',
  });

  useEffect(() => {
    if (user) {
      fetchDeals();
    }
  }, [user]);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('pmp_deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals((data as PMPDeal[]) || []);
    } catch (error) {
      console.error('Error fetching PMP deals:', error);
      toast.error('Failed to load PMP deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const dealData = {
        ...formData,
        floor_price: parseFloat(formData.floor_price) || 0,
        priority: parseInt(formData.priority) || 1,
        margin_percentage: Math.min(parseFloat(formData.margin_percentage) || 0, 50),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingDeal) {
        const { error } = await supabase
          .from('pmp_deals')
          .update(dealData)
          .eq('id', editingDeal.id);

        if (error) throw error;
        toast.success('Deal updated successfully');
      } else {
        const { error } = await supabase
          .from('pmp_deals')
          .insert({
            ...dealData,
            user_id: user.id,
          });

        if (error) throw error;
        toast.success('Deal created successfully');
      }

      setIsDialogOpen(false);
      setEditingDeal(null);
      resetForm();
      fetchDeals();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Failed to save deal');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('pmp_deals')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Deal ${newStatus === 'active' ? 'activated' : 'paused'}`);
      fetchDeals();
    } catch (error) {
      console.error('Error updating deal status:', error);
      toast.error('Failed to update deal status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pmp_deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Deal deleted successfully');
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  const openEditDialog = (deal: PMPDeal) => {
    setEditingDeal(deal);
    setFormData({
      deal_name: deal.deal_name,
      deal_id: deal.deal_id,
      dsp_name: deal.dsp_name,
      floor_price: deal.floor_price.toString(),
      currency: deal.currency,
      deal_type: deal.deal_type,
      priority: deal.priority.toString(),
      status: deal.status,
      start_date: deal.start_date ? deal.start_date.split('T')[0] : '',
      end_date: deal.end_date ? deal.end_date.split('T')[0] : '',
      description: deal.description || '',
      margin_percentage: '10', // Default margin for existing deals
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      deal_name: '',
      deal_id: '',
      dsp_name: '',
      floor_price: '',
      currency: 'USD',
      deal_type: 'fixed_price',
      priority: '1',
      status: 'active',
      start_date: '',
      end_date: '',
      description: '',
      margin_percentage: '10',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
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
        <div>
          <h1 className="text-3xl font-bold">PMP Deals</h1>
          <p className="text-muted-foreground">
            Manage your Private Marketplace deals across different DSPs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingDeal(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDeal ? 'Edit PMP Deal' : 'Create New PMP Deal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deal_name">Deal Name</Label>
                  <Input
                    id="deal_name"
                    value={formData.deal_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, deal_name: e.target.value }))}
                    placeholder="Enter deal name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deal_id">Deal ID</Label>
                  <Input
                    id="deal_id"
                    value={formData.deal_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, deal_id: e.target.value }))}
                    placeholder="Enter deal ID"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dsp_name">DSP Platform</Label>
                  <Select 
                    value={formData.dsp_name} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dsp_name: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select DSP" />
                    </SelectTrigger>
                    <SelectContent>
                      {DSP_OPTIONS.map((dsp) => (
                        <SelectItem key={dsp} value={dsp}>{dsp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deal_type">Deal Type</Label>
                  <Select 
                    value={formData.deal_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, deal_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor_price">Floor Price</Label>
                  <Input
                    id="floor_price"
                    type="number"
                    step="0.01"
                    value={formData.floor_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, floor_price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin_percentage">Profit Margin (%)</Label>
                  <Input
                    id="margin_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={formData.margin_percentage}
                    onChange={(e) => {
                      const value = Math.min(parseFloat(e.target.value) || 0, 50);
                      setFormData(prev => ({ ...prev, margin_percentage: value.toString() }));
                    }}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">Maximum 50%</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    placeholder="1"
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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deal description..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDeal ? 'Update' : 'Create'} Deal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PMP Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No PMP deals found. Create your first deal to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal Name</TableHead>
                  <TableHead>Deal ID</TableHead>
                  <TableHead>DSP</TableHead>
                  <TableHead>Floor Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.deal_name}</TableCell>
                    <TableCell className="font-mono">{deal.deal_id}</TableCell>
                    <TableCell>{deal.dsp_name}</TableCell>
                    <TableCell>
                      {deal.floor_price > 0 ? `${deal.currency} ${deal.floor_price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{deal.deal_type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(deal.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusToggle(deal.id, deal.status)}
                        >
                          {deal.status === 'active' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(deal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(deal.id)}
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
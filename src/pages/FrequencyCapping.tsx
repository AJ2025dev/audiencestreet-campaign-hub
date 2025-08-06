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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Plus, Edit } from 'lucide-react';

interface FrequencyCap {
  id: string;
  campaign_id: string;
  cap_type: 'daily' | 'weekly' | 'monthly' | 'lifetime';
  max_impressions: number;
  time_window_hours?: number;
  is_active: boolean;
  created_at: string;
}

export default function FrequencyCapping() {
  const { user } = useAuth();
  const [caps, setCaps] = useState<FrequencyCap[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCap, setEditingCap] = useState<FrequencyCap | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    campaign_id: '',
    cap_type: 'daily' as 'daily' | 'weekly' | 'monthly' | 'lifetime',
    max_impressions: 1,
    time_window_hours: 24,
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      fetchCaps();
    }
  }, [user]);

  const fetchCaps = async () => {
    try {
      const { data, error } = await supabase
        .from('frequency_caps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaps((data as FrequencyCap[]) || []);
    } catch (error) {
      console.error('Error fetching frequency caps:', error);
      toast.error('Failed to load frequency caps');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const capData = {
        ...formData,
        user_id: user.id,
        time_window_hours: formData.cap_type === 'daily' ? 24 :
                          formData.cap_type === 'weekly' ? 168 :
                          formData.cap_type === 'monthly' ? 720 :
                          null, // lifetime has no time window
      };

      if (editingCap) {
        const { error } = await supabase
          .from('frequency_caps')
          .update({
            ...capData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCap.id);

        if (error) throw error;
        toast.success('Frequency cap updated successfully');
      } else {
        const { error } = await supabase
          .from('frequency_caps')
          .insert(capData);

        if (error) throw error;
        toast.success('Frequency cap added successfully');
      }

      setIsDialogOpen(false);
      setEditingCap(null);
      setFormData({
        campaign_id: '',
        cap_type: 'daily',
        max_impressions: 1,
        time_window_hours: 24,
        is_active: true,
      });
      fetchCaps();
    } catch (error) {
      console.error('Error saving frequency cap:', error);
      toast.error('Failed to save frequency cap');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('frequency_caps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Frequency cap deleted successfully');
      fetchCaps();
    } catch (error) {
      console.error('Error deleting frequency cap:', error);
      toast.error('Failed to delete frequency cap');
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('frequency_caps')
        .update({ is_active: !is_active })
        .eq('id', id);

      if (error) throw error;
      fetchCaps();
    } catch (error) {
      console.error('Error updating frequency cap:', error);
      toast.error('Failed to update frequency cap');
    }
  };

  const openEditDialog = (cap: FrequencyCap) => {
    setEditingCap(cap);
    setFormData({
      campaign_id: cap.campaign_id,
      cap_type: cap.cap_type,
      max_impressions: cap.max_impressions,
      time_window_hours: cap.time_window_hours || 24,
      is_active: cap.is_active,
    });
    setIsDialogOpen(true);
  };

  const getCapTypeDisplay = (capType: string, timeWindow?: number) => {
    switch (capType) {
      case 'daily': return `Daily (${timeWindow || 24}h)`;
      case 'weekly': return `Weekly (${timeWindow || 168}h)`;
      case 'monthly': return `Monthly (${timeWindow || 720}h)`;
      case 'lifetime': return 'Lifetime';
      default: return capType;
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
          <h1 className="text-3xl font-bold">Frequency Capping</h1>
          <p className="text-muted-foreground">
            Manage impression frequency limits for your campaigns
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCap(null);
              setFormData({
                campaign_id: '',
                cap_type: 'daily',
                max_impressions: 1,
                time_window_hours: 24,
                is_active: true,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Frequency Cap
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCap ? 'Edit Frequency Cap' : 'Add New Frequency Cap'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign_id">Campaign ID</Label>
                <Input
                  id="campaign_id"
                  value={formData.campaign_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign_id: e.target.value }))}
                  placeholder="Enter campaign ID"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cap_type">Cap Type</Label>
                  <Select 
                    value={formData.cap_type} 
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'lifetime') => {
                      const timeWindow = value === 'daily' ? 24 :
                                       value === 'weekly' ? 168 :
                                       value === 'monthly' ? 720 : 24;
                      setFormData(prev => ({ ...prev, cap_type: value, time_window_hours: timeWindow }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_impressions">Max Impressions</Label>
                  <Input
                    id="max_impressions"
                    type="number"
                    min="1"
                    value={formData.max_impressions}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_impressions: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              {formData.cap_type !== 'lifetime' && (
                <div className="space-y-2">
                  <Label htmlFor="time_window_hours">Time Window (Hours)</Label>
                  <Input
                    id="time_window_hours"
                    type="number"
                    min="1"
                    value={formData.time_window_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_window_hours: parseInt(e.target.value) }))}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCap ? 'Update' : 'Add'} Cap
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequency Caps</CardTitle>
        </CardHeader>
        <CardContent>
          {caps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No frequency caps found. Add your first cap to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Cap Type</TableHead>
                  <TableHead>Max Impressions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caps.map((cap) => (
                  <TableRow key={cap.id}>
                    <TableCell className="font-mono">{cap.campaign_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCapTypeDisplay(cap.cap_type, cap.time_window_hours)}
                      </Badge>
                    </TableCell>
                    <TableCell>{cap.max_impressions}</TableCell>
                    <TableCell>
                      <Switch
                        checked={cap.is_active}
                        onCheckedChange={() => handleToggleActive(cap.id, cap.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(cap)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cap.id)}
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
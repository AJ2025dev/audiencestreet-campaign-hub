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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Plus, Edit, Globe } from 'lucide-react';

interface PublisherListEntry {
  id: string;
  list_type: 'allowlist' | 'blocklist';
  value: string;
  description?: string;
  is_active: boolean;
  campaign_id?: string;
  is_global: boolean;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
}

export default function PublisherLists() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PublisherListEntry[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PublisherListEntry | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    list_type: 'allowlist' as 'allowlist' | 'blocklist',
    value: '',
    description: '',
    is_active: true,
    campaign_id: '',
    is_global: false,
  });

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchCampaigns();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('domain_lists')
        .select('*')
        .eq('entry_type', 'site')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries((data as PublisherListEntry[]) || []);
    } catch (error) {
      console.error('Error fetching publisher lists:', error);
      toast.error('Failed to load publisher lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCampaigns((data as Campaign[]) || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('domain_lists')
          .update({
            ...formData,
            entry_type: 'site',
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast.success('Publisher entry updated successfully');
      } else {
        const { error } = await supabase
          .from('domain_lists')
          .insert({
            ...formData,
            entry_type: 'site',
            user_id: user.id,
          });

        if (error) throw error;
        toast.success('Publisher entry added successfully');
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
      setFormData({
        list_type: 'allowlist',
        value: '',
        description: '',
        is_active: true,
        campaign_id: '',
        is_global: false,
      });
      fetchEntries();
    } catch (error) {
      console.error('Error saving publisher entry:', error);
      toast.error('Failed to save publisher entry');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('domain_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Publisher entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('Error deleting publisher entry:', error);
      toast.error('Failed to delete publisher entry');
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('domain_lists')
        .update({ is_active: !is_active })
        .eq('id', id);

      if (error) throw error;
      fetchEntries();
    } catch (error) {
      console.error('Error updating publisher entry:', error);
      toast.error('Failed to update publisher entry');
    }
  };

  const openEditDialog = (entry: PublisherListEntry) => {
    setEditingEntry(entry);
    setFormData({
      list_type: entry.list_type,
      value: entry.value,
      description: entry.description || '',
      is_active: entry.is_active,
      campaign_id: entry.campaign_id || '',
      is_global: entry.is_global,
    });
    setIsDialogOpen(true);
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Publisher Lists
          </h1>
          <p className="text-muted-foreground">
            Manage allowlists and blocklists for publisher sites and domains
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEntry(null);
              setFormData({
                list_type: 'allowlist',
                value: '',
                description: '',
                is_active: true,
                campaign_id: '',
                is_global: false,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Publisher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Publisher Entry' : 'Add New Publisher Entry'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="list_type">List Type</Label>
                <Select 
                  value={formData.list_type} 
                  onValueChange={(value: 'allowlist' | 'blocklist') => 
                    setFormData(prev => ({ ...prev, list_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allowlist">Allowlist</SelectItem>
                    <SelectItem value="blocklist">Blocklist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Publisher Domain/Site</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., example.com, news.website.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter publisher description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign_id">Link to Campaign (Optional)</Label>
                <Select 
                  value={formData.campaign_id} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, campaign_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No campaign (Global)</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_global"
                  checked={formData.is_global}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_global: checked }))}
                />
                <Label htmlFor="is_global">Apply Globally</Label>
              </div>
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
                  {editingEntry ? 'Update' : 'Add'} Publisher
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publisher List Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No publisher entries found. Add your first publisher to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Publisher Domain</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant={entry.list_type === 'allowlist' ? 'default' : 'destructive'}>
                        {entry.list_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{entry.value}</TableCell>
                    <TableCell>
                      {entry.campaign_id ? (
                        <Badge variant="secondary">
                          {campaigns.find(c => c.id === entry.campaign_id)?.name || 'Campaign'}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.is_global ? 'default' : 'outline'}>
                        {entry.is_global ? 'Global' : 'Specific'}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.description || '-'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={entry.is_active}
                        onCheckedChange={() => handleToggleActive(entry.id, entry.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
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
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
import { Trash2, Plus, Edit } from 'lucide-react';

interface DomainListEntry {
  id: string;
  list_type: 'allowlist' | 'blocklist';
  entry_type: 'domain' | 'site' | 'app' | 'ip';
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

export default function DomainLists() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DomainListEntry[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DomainListEntry | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    list_type: 'allowlist' as 'allowlist' | 'blocklist',
    entry_type: 'domain' as 'domain' | 'site' | 'app' | 'ip',
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries((data as DomainListEntry[]) || []);
    } catch (error) {
      console.error('Error fetching domain lists:', error);
      toast.error('Failed to load domain lists');
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
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast.success('Entry updated successfully');
      } else {
        const { error } = await supabase
          .from('domain_lists')
          .insert({
            ...formData,
            user_id: user.id,
          });

        if (error) throw error;
        toast.success('Entry added successfully');
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
      setFormData({
        list_type: 'allowlist',
        entry_type: 'domain',
        value: '',
        description: '',
        is_active: true,
        campaign_id: '',
        is_global: false,
      });
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('domain_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
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
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry');
    }
  };

  const openEditDialog = (entry: DomainListEntry) => {
    setEditingEntry(entry);
    setFormData({
      list_type: entry.list_type,
      entry_type: entry.entry_type,
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
          <h1 className="text-3xl font-bold">Domain Lists</h1>
          <p className="text-muted-foreground">
            Manage allowlists and blocklists for domains, sites, apps, and IPs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEntry(null);
              setFormData({
                list_type: 'allowlist',
                entry_type: 'domain',
                value: '',
                description: '',
                is_active: true,
                campaign_id: '',
                is_global: false,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Entry' : 'Add New Entry'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="entry_type">Entry Type</Label>
                  <Select 
                    value={formData.entry_type} 
                    onValueChange={(value: 'domain' | 'site' | 'app' | 'ip') => 
                      setFormData(prev => ({ ...prev, entry_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="app">App</SelectItem>
                      <SelectItem value="ip">IP Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., example.com, 192.168.1.1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter a description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  {editingEntry ? 'Update' : 'Add'} Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Domain List Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No entries found. Add your first entry to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
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
                    <TableCell>
                      <Badge variant="outline">{entry.entry_type}</Badge>
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
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, Edit, BarChart3, Settings, Plus } from "lucide-react";

interface EquativCampaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  targeting: any;
  creatives: any[];
}

export default function EquativCampaigns() {
  const [campaigns, setCampaigns] = useState<EquativCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EquativCampaign | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>({});
  const { toast } = useToast();

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    budget: "",
    currency: "USD",
    startDate: "",
    endDate: "",
    status: "PAUSED"
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-campaign-management', {
        body: { action: 'list_campaigns' }
      });

      if (error) throw error;
      setCampaigns(data.campaigns || []);
    } catch (error: any) {
      toast({
        title: "Error loading campaigns",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-campaign-management', {
        body: {
          action: 'create_campaign',
          campaignData: {
            ...newCampaign,
            budget: parseFloat(newCampaign.budget)
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Campaign Created",
        description: `Campaign "${newCampaign.name}" has been created successfully.`,
      });

      setNewCampaign({
        name: "",
        budget: "",
        currency: "USD", 
        startDate: "",
        endDate: "",
        status: "PAUSED"
      });
      setIsCreateDialogOpen(false);
      loadCampaigns();
    } catch (error: any) {
      toast({
        title: "Error creating campaign",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId: string, newStatus: string) => {
    setLoading(true);
    try {
      const action = newStatus === 'ACTIVE' ? 'activate_campaign' : 'pause_campaign';
      const { error } = await supabase.functions.invoke('equativ-campaign-management', {
        body: { action, campaignId }
      });

      if (error) throw error;
      
      toast({
        title: "Campaign Updated",
        description: `Campaign ${newStatus.toLowerCase()} successfully.`,
      });
      
      loadCampaigns();
    } catch (error: any) {
      toast({
        title: "Error updating campaign",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignStats = async (campaignId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('equativ-campaign-management', {
        body: { action: 'get_campaign_stats', campaignId }
      });

      if (error) throw error;
      setStats(prev => ({ ...prev, [campaignId]: data }));
    } catch (error: any) {
      toast({
        title: "Error loading stats",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'COMPLETED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equativ Campaigns</h1>
          <p className="text-muted-foreground">Manage your programmatic advertising campaigns</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new programmatic advertising campaign on Equativ
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={newCampaign.currency} 
                    onValueChange={(value) => setNewCampaign(prev => ({ ...prev, currency: value }))}
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
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={createCampaign} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No campaigns found</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  Create your first campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.currency} {campaign.budget.toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <div>Start: {new Date(campaign.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(campaign.endDate).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {campaign.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCampaignStatus(campaign.id, 'PAUSED')}
                          >
                            <Pause className="mr-1 h-3 w-3" />
                            Pause
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCampaignStatus(campaign.id, 'ACTIVE')}
                          >
                            <Play className="mr-1 h-3 w-3" />
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadCampaignStats(campaign.id)}
                        >
                          <BarChart3 className="mr-1 h-3 w-3" />
                          Stats
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'ACTIVE').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paused Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'PAUSED').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'COMPLETED').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
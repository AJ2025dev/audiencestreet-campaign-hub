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
import { Users, Search, Plus, Upload, Eye, BarChart3, Trash2 } from "lucide-react";

interface Audience {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  size: number;
  dataSource: string;
  createdAt: string;
  updatedAt: string;
}

interface AudienceInsights {
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  };
  interests: Record<string, number>;
  behavior: Record<string, number>;
}

export default function EquativAudiences() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [insights, setInsights] = useState<AudienceInsights | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newAudience, setNewAudience] = useState({
    name: "",
    description: "",
    type: "CUSTOM",
    dataSource: "FIRST_PARTY",
    rules: [] as any[],
  });

  const [uploadData, setUploadData] = useState({
    audienceId: "",
    data: "",
    format: "EMAIL_HASH",
    matchType: "EXACT",
  });

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-audience-management', {
        body: { action: 'list_audiences' }
      });

      if (error) throw error;
      
      // Simulate audience data for demo
      setAudiences([
        {
          id: "aud_001",
          name: "High-Value Shoppers",
          description: "Customers with high purchase frequency and value",
          type: "CUSTOM",
          status: "ACTIVE",
          size: 125000,
          dataSource: "FIRST_PARTY",
          createdAt: "2024-01-15",
          updatedAt: "2024-03-20"
        },
        {
          id: "aud_002",
          name: "Cart Abandoners",
          description: "Users who added items to cart but didn't complete purchase",
          type: "CUSTOM",
          status: "ACTIVE",
          size: 87500,
          dataSource: "FIRST_PARTY",
          createdAt: "2024-02-01",
          updatedAt: "2024-03-15"
        },
        {
          id: "aud_003",
          name: "Tech Enthusiasts",
          description: "Users interested in technology products",
          type: "THIRD_PARTY",
          status: "ACTIVE",
          size: 2500000,
          dataSource: "THIRD_PARTY",
          createdAt: "2024-01-10",
          updatedAt: "2024-03-10"
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error loading audiences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAudience = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-audience-management', {
        body: {
          action: 'create_audience',
          audienceData: newAudience
        }
      });

      if (error) throw error;
      
      toast({
        title: "Audience Created",
        description: `Audience "${newAudience.name}" has been created successfully.`,
      });

      setNewAudience({
        name: "",
        description: "",
        type: "CUSTOM",
        dataSource: "FIRST_PARTY",
        rules: [],
      });
      setIsCreateDialogOpen(false);
      
      // Add to local state for demo
      setAudiences(prev => [...prev, {
        id: `aud_${Date.now()}`,
        ...newAudience,
        status: "ACTIVE",
        size: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    } catch (error: any) {
      toast({
        title: "Error creating audience",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAudienceInsights = async (audienceId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-audience-management', {
        body: { action: 'get_audience_insights', audienceId }
      });

      if (error) throw error;
      
      // Simulate insights data for demo
      setInsights({
        demographics: {
          age: { "18-24": 15, "25-34": 35, "35-44": 25, "45-54": 15, "55+": 10 },
          gender: { Male: 55, Female: 45 },
          location: { US: 40, UK: 20, CA: 15, DE: 10, FR: 10, Other: 5 }
        },
        interests: { "Technology": 30, "Gaming": 25, "Sports": 20, "Entertainment": 15, "Travel": 10 },
        behavior: { "Frequent Shoppers": 40, "Brand Loyal": 30, "Deal Seekers": 20, "Luxury": 10 }
      });
    } catch (error: any) {
      toast({
        title: "Error loading insights",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAudienceData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-audience-management', {
        body: {
          action: 'upload_audience_data',
          audienceId: uploadData.audienceId,
          audienceData: {
            data: uploadData.data.split('\n').filter(line => line.trim()),
            format: uploadData.format,
            matchType: uploadData.matchType
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Data Uploaded",
        description: "Audience data has been uploaded successfully.",
      });

      setUploadData({
        audienceId: "",
        data: "",
        format: "EMAIL_HASH",
        matchType: "EXACT",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAudience = async (audienceId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-audience-management', {
        body: { action: 'delete_audience', audienceId }
      });

      if (error) throw error;
      
      toast({
        title: "Audience Deleted",
        description: "Audience has been deleted successfully.",
      });

      // Remove from local state for demo
      setAudiences(prev => prev.filter(audience => audience.id !== audienceId));
    } catch (error: any) {
      toast({
        title: "Error deleting audience",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'PENDING': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CUSTOM': return 'bg-purple-500';
      case 'THIRD_PARTY': return 'bg-blue-500';
      case 'LOOKALIKE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equativ Audiences</h1>
          <p className="text-muted-foreground">Manage and analyze audience segments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Audience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Audience</DialogTitle>
              <DialogDescription>
                Define a new audience segment for targeting
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="audienceName">Audience Name</Label>
                <Input
                  id="audienceName"
                  value={newAudience.name}
                  onChange={(e) => setNewAudience(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter audience name"
                />
              </div>
              <div>
                <Label htmlFor="audienceDescription">Description</Label>
                <Textarea
                  id="audienceDescription"
                  value={newAudience.description}
                  onChange={(e) => setNewAudience(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your audience"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audienceType">Audience Type</Label>
                  <Select 
                    value={newAudience.type} 
                    onValueChange={(value) => setNewAudience(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                      <SelectItem value="THIRD_PARTY">Third Party</SelectItem>
                      <SelectItem value="LOOKALIKE">Lookalike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dataSource">Data Source</Label>
                  <Select 
                    value={newAudience.dataSource} 
                    onValueChange={(value) => setNewAudience(prev => ({ ...prev, dataSource: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIRST_PARTY">First Party</SelectItem>
                      <SelectItem value="THIRD_PARTY">Third Party</SelectItem>
                      <SelectItem value="COMBINED">Combined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={createAudience} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Audience"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="audiences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audiences">Audiences</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="upload">Data Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="audiences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Segments</CardTitle>
              <CardDescription>
                View and manage your audience segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {audiences.map((audience) => (
                  <Card key={audience.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{audience.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {audience.description}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getStatusColor(audience.status)}>
                            {audience.status}
                          </Badge>
                          <Badge className={getTypeColor(audience.type)}>
                            {audience.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium">
                            {audience.size.toLocaleString()} users
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Data Source:</span>
                          <span className="font-medium">{audience.dataSource}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Created: {new Date(audience.createdAt).toLocaleDateString()}</div>
                          <div>Updated: {new Date(audience.updatedAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadAudienceInsights(audience.id)}
                            className="flex-1"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View Insights
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteAudience(audience.id)}
                            className="flex-1"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Age Distribution</h4>
                      {Object.entries(insights.demographics.age).map(([age, percentage]) => (
                        <div key={age} className="flex items-center justify-between text-sm mb-1">
                          <span>{age}</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-muted rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span>{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Gender Distribution</h4>
                      {Object.entries(insights.demographics.gender).map(([gender, percentage]) => (
                        <div key={gender} className="flex items-center justify-between text-sm mb-1">
                          <span>{gender}</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-muted rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span>{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(insights.interests).map(([interest, percentage]) => (
                      <div key={interest} className="flex items-center justify-between">
                        <span className="text-sm">{interest}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-muted rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm w-8">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Behavior</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(insights.behavior).map(([behavior, percentage]) => (
                      <div key={behavior} className="flex items-center justify-between">
                        <span className="text-sm">{behavior}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-muted rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm w-8">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Select an audience to view insights</p>
                <Button onClick={() => loadAudienceInsights("aud_001")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Load Sample Insights
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Audience Data</CardTitle>
              <CardDescription>
                Add user data to your audience segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audienceSelect">Select Audience</Label>
                  <Select 
                    value={uploadData.audienceId} 
                    onValueChange={(value) => setUploadData(prev => ({ ...prev, audienceId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.id} value={audience.id}>
                          {audience.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataFormat">Data Format</Label>
                    <Select 
                      value={uploadData.format} 
                      onValueChange={(value) => setUploadData(prev => ({ ...prev, format: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL_HASH">Email Hash</SelectItem>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="USER_ID">User ID</SelectItem>
                        <SelectItem value="MOBILE_HASH">Mobile Hash</SelectItem>
                        <SelectItem value="MOBILE">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="matchType">Match Type</Label>
                    <Select 
                      value={uploadData.matchType} 
                      onValueChange={(value) => setUploadData(prev => ({ ...prev, matchType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXACT">Exact</SelectItem>
                        <SelectItem value="FUZZY">Fuzzy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="audienceData">Audience Data</Label>
                  <Textarea
                    id="audienceData"
                    value={uploadData.data}
                    onChange={(e) => setUploadData(prev => ({ ...prev, data: e.target.value }))}
                    placeholder="Enter one identifier per line"
                    rows={6}
                  />
                </div>
                
                <Button onClick={uploadAudienceData} disabled={loading} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {loading ? "Uploading..." : "Upload Data"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

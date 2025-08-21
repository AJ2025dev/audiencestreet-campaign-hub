import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BarChart3, Eye, Target, Download, Play, Pause, BarChart } from "lucide-react";

interface CampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  costPerConversion: number;
  spend: number;
  date: string;
}

interface RealTimeStats {
  campaignId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  spend: number;
  timestamp: string;
}

interface ConversionTracking {
  id: string;
  name: string;
  type: string;
  campaignIds: string[];
  conversionWindow: number;
  attributionModel: string;
  url: string;
  status: string;
}

interface AttributionReport {
  campaignId: string;
  model: string;
  conversions: number;
  attributedConversions: number;
  conversionRate: number;
  revenue: number;
  roas: number;
}

export default function EquativTracking() {
  const [metrics, setMetrics] = useState<CampaignMetrics[]>([]);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats[]>([]);
  const [conversionTrackings, setConversionTrackings] = useState<ConversionTracking[]>([]);
  const [attributionReports, setAttributionReports] = useState<AttributionReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const { toast } = useToast();

  const [newConversionTracking, setNewConversionTracking] = useState({
    name: "",
    type: "POSTBACK",
    campaignIds: [] as string[],
    conversionWindow: 30,
    attributionModel: "LAST_CLICK",
    url: "",
  });

  useEffect(() => {
    // Load initial data
    loadConversionTrackings();
  }, []);

  const loadCampaignMetrics = async () => {
    if (!selectedCampaign) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-tracking', {
        body: { 
          action: 'get_campaign_metrics',
          campaignId: selectedCampaign,
          dateRange: dateRange,
          trackingData: { groupBy: 'date' }
        }
      });

      if (error) throw error;
      
      // Simulate metrics data for demo
      setMetrics([
        {
          campaignId: selectedCampaign,
          impressions: 125000,
          clicks: 2500,
          ctr: 2.0,
          conversions: 125,
          conversionRate: 5.0,
          costPerConversion: 8.0,
          spend: 2000,
          date: new Date().toISOString()
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error loading campaign metrics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeStats = async () => {
    if (!selectedCampaign) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-tracking', {
        body: { 
          action: 'get_real_time_stats',
          campaignId: selectedCampaign
        }
      });

      if (error) throw error;
      
      // Simulate real-time stats for demo
      setRealTimeStats([
        {
          campaignId: selectedCampaign,
          impressions: 1250,
          clicks: 25,
          ctr: 2.0,
          conversions: 2,
          spend: 20,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error loading real-time stats",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConversionTrackings = async () => {
    setLoading(true);
    try {
      // This would typically be a list operation, but we'll simulate data
      setConversionTrackings([
        {
          id: "conv_001",
          name: "Purchase Conversion",
          type: "POSTBACK",
          campaignIds: ["camp_001", "camp_002"],
          conversionWindow: 30,
          attributionModel: "LAST_CLICK",
          url: "https://example.com/postback",
          status: "ACTIVE"
        },
        {
          id: "conv_002",
          name: "Lead Generation",
          type: "PIXEL",
          campaignIds: ["camp_003"],
          conversionWindow: 7,
          attributionModel: "FIRST_CLICK",
          url: "https://example.com/pixel",
          status: "ACTIVE"
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error loading conversion trackings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversionTracking = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-tracking', {
        body: {
          action: 'create_conversion_tracking',
          trackingData: newConversionTracking
        }
      });

      if (error) throw error;
      
      toast({
        title: "Conversion Tracking Created",
        description: `Conversion tracking "${newConversionTracking.name}" has been created successfully.`,
      });

      setNewConversionTracking({
        name: "",
        type: "POSTBACK",
        campaignIds: [],
        conversionWindow: 30,
        attributionModel: "LAST_CLICK",
        url: "",
      });
      
      // Add to local state for demo
      setConversionTrackings(prev => [...prev, {
        id: `conv_${Date.now()}`,
        ...newConversionTracking,
        status: "ACTIVE"
      }]);
    } catch (error: any) {
      toast({
        title: "Error creating conversion tracking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAttributionReport = async () => {
    if (!selectedCampaign) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-tracking', {
        body: {
          action: 'get_attribution_report',
          trackingData: {
            campaignIds: [selectedCampaign],
            attributionModel: "LAST_CLICK",
            conversionWindow: 30
          },
          dateRange: dateRange
        }
      });

      if (error) throw error;
      
      // Simulate attribution report for demo
      setAttributionReports([
        {
          campaignId: selectedCampaign,
          model: "LAST_CLICK",
          conversions: 125,
          attributedConversions: 110,
          conversionRate: 5.0,
          revenue: 12500,
          roas: 6.25
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error loading attribution report",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equativ Tracking</h1>
          <p className="text-muted-foreground">Monitor and analyze campaign performance</p>
        </div>
        <Button onClick={loadRealTimeStats} disabled={loading || !selectedCampaign}>
          <BarChart className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Tracking</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter Campaign Metrics</CardTitle>
              <CardDescription>
                Select a campaign and date range to view performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="campaign">Campaign</Label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camp_001">Summer Sale Campaign</SelectItem>
                      <SelectItem value="camp_002">Product Launch</SelectItem>
                      <SelectItem value="camp_003">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={loadCampaignMetrics} disabled={loading || !selectedCampaign}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {loading ? "Loading..." : "Load Metrics"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics[0].impressions.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics[0].clicks.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CTR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics[0].ctr}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics[0].spend.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Campaign Stats</CardTitle>
              <CardDescription>
                Live performance data for your selected campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              {realTimeStats.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{realTimeStats[0].impressions}</div>
                    <div className="text-sm text-muted-foreground">Impressions</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{realTimeStats[0].clicks}</div>
                    <div className="text-sm text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{realTimeStats[0].ctr}%</div>
                    <div className="text-sm text-muted-foreground">CTR</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a campaign and click "Refresh Data" to view real-time stats
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Conversion Tracking</CardTitle>
              <CardDescription>
                Set up conversion tracking for your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="conversionName">Tracking Name</Label>
                  <Input
                    id="conversionName"
                    value={newConversionTracking.name}
                    onChange={(e) => setNewConversionTracking(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter tracking name"
                  />
                </div>
                <div>
                  <Label htmlFor="conversionType">Tracking Type</Label>
                  <Select 
                    value={newConversionTracking.type} 
                    onValueChange={(value) => setNewConversionTracking(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POSTBACK">Postback</SelectItem>
                      <SelectItem value="PIXEL">Pixel</SelectItem>
                      <SelectItem value="SERVER_TO_SERVER">Server-to-Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="conversionWindow">Conversion Window (days)</Label>
                  <Input
                    id="conversionWindow"
                    type="number"
                    value={newConversionTracking.conversionWindow}
                    onChange={(e) => setNewConversionTracking(prev => ({ ...prev, conversionWindow: parseInt(e.target.value) || 30 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="attributionModel">Attribution Model</Label>
                  <Select 
                    value={newConversionTracking.attributionModel} 
                    onValueChange={(value) => setNewConversionTracking(prev => ({ ...prev, attributionModel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LAST_CLICK">Last Click</SelectItem>
                      <SelectItem value="FIRST_CLICK">First Click</SelectItem>
                      <SelectItem value="LINEAR">Linear</SelectItem>
                      <SelectItem value="TIME_DECAY">Time Decay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="conversionUrl">Tracking URL</Label>
                  <Input
                    id="conversionUrl"
                    value={newConversionTracking.url}
                    onChange={(e) => setNewConversionTracking(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Enter tracking URL"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={createConversionTracking} disabled={loading}>
                  <Target className="mr-2 h-4 w-4" />
                  {loading ? "Creating..." : "Create Conversion Tracking"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversionTrackings.map((tracking) => (
              <Card key={tracking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{tracking.name}</CardTitle>
                      <CardDescription>{tracking.type} tracking</CardDescription>
                    </div>
                    <Badge variant={tracking.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {tracking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Window:</span> {tracking.conversionWindow} days
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Model:</span> {tracking.attributionModel}
                    </div>
                    <div className="text-sm truncate">
                      <span className="text-muted-foreground">URL:</span> {tracking.url}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Campaigns:</span> {tracking.campaignIds.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Report</CardTitle>
              <CardDescription>
                Multi-touch attribution analysis for your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="attrCampaign">Campaign</Label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camp_001">Summer Sale Campaign</SelectItem>
                      <SelectItem value="camp_002">Product Launch</SelectItem>
                      <SelectItem value="camp_003">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={loadAttributionReport} disabled={loading || !selectedCampaign}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {loading ? "Loading..." : "Generate Report"}
                  </Button>
                </div>
              </div>

              {attributionReports.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{attributionReports[0].conversions}</div>
                        <div className="text-sm text-muted-foreground">Total Conversions</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{attributionReports[0].conversionRate}%</div>
                        <div className="text-sm text-muted-foreground">Conversion Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{attributionReports[0].roas}x</div>
                        <div className="text-sm text-muted-foreground">ROAS</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

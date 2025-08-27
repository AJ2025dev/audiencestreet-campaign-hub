import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, Eye, TrendingUp, Globe, Smartphone, Monitor } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  adFormat: string;
  geography: string;
  category: string;
  deviceType: string;
  pricing: {
    cpm: number;
    currency: string;
  };
  availability: {
    impressions: number;
    reach: number;
  };
  quality: {
    score: number;
    viewability: number;
    brandSafety: string;
  };
}

interface ForecastData {
  estimatedImpressions: number;
  estimatedReach: number;
  recommendedBudget: number;
  confidence: number;
}

export default function EquativInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    geography: "",
    adFormat: "",
    deviceType: "",
    category: ""
  });

  const [forecastParams, setForecastParams] = useState({
    budget: "",
    startDate: "",
    endDate: "",
    targeting: {}
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const pullInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-inventory-analysis', {
        body: {
          action: 'pull_inventory',
          filters: {}
        }
      });

      if (error) throw error;
      
      // After pulling, refresh the inventory list
      await loadInventory();
      
      toast({
        title: "Inventory Pull Successful",
        description: "Inventory data has been successfully pulled from Equativ.",
      });
    } catch (error: any) {
      toast({
        title: "Error pulling inventory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-inventory-analysis', {
        body: { 
          action: 'get_inventory',
          filters: filters
        }
      });

      if (error) throw error;
      setInventory(data.inventory || []);
    } catch (error: any) {
      toast({
        title: "Error loading inventory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryDetails = async (inventoryId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('equativ-inventory-analysis', {
        body: { 
          action: 'get_inventory_details',
          inventoryId
        }
      });

      if (error) throw error;
      setSelectedItem(data);
    } catch (error: any) {
      toast({
        title: "Error loading inventory details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateForecast = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-inventory-analysis', {
        body: { 
          action: 'get_inventory_forecast',
          filters: {
            ...forecastParams,
            budget: parseFloat(forecastParams.budget)
          }
        }
      });

      if (error) throw error;
      setForecast(data);
      
      toast({
        title: "Forecast Generated",
        description: "Inventory forecast has been generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating forecast",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equativ Inventory</h1>
          <p className="text-muted-foreground">Analyze and forecast programmatic inventory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={pullInventory} disabled={loading}>
            {loading ? "Pulling..." : "Pull Inventory"}
          </Button>
          <Button onClick={loadInventory} disabled={loading}>
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Searching..." : "Search Inventory"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter Inventory</CardTitle>
              <CardDescription>
                Apply filters to find the most relevant inventory for your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="geography">Geography</Label>
                  <Select 
                    value={filters.geography} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, geography: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select geography" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="adFormat">Ad Format</Label>
                  <Select 
                    value={filters.adFormat} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, adFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANNER">Banner</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="NATIVE">Native</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deviceType">Device Type</Label>
                  <Select 
                    value={filters.deviceType} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, deviceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DESKTOP">Desktop</SelectItem>
                      <SelectItem value="MOBILE">Mobile</SelectItem>
                      <SelectItem value="TABLET">Tablet</SelectItem>
                      <SelectItem value="CTV">Connected TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEWS">News</SelectItem>
                      <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                      <SelectItem value="SPORTS">Sports</SelectItem>
                      <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => loadInventoryDetails(item.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getDeviceIcon(item.deviceType)}
                          {item.name}
                        </CardTitle>
                        <CardDescription>
                          {item.adFormat} • {item.geography}
                        </CardDescription>
                      </div>
                      <Badge className={getQualityColor(item.quality.score)}>
                        Quality: {item.quality.score}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">CPM:</span>
                        <span className="font-medium">
                          {item.pricing.currency} {item.pricing.cpm}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Impressions:</span>
                        <span className="font-medium">
                          {item.availability.impressions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Reach:</span>
                        <span className="font-medium">
                          {item.availability.reach.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Viewability:</span>
                        <span className="font-medium">{item.quality.viewability}%</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadInventoryDetails(item.id);
                        }}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Inventory Forecast</CardTitle>
              <CardDescription>
                Predict inventory performance and availability for your campaign parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="budget">Campaign Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={forecastParams.budget}
                    onChange={(e) => setForecastParams(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="Enter budget amount"
                  />
                </div>
                <div>
                  <Label htmlFor="adFormat">Ad Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANNER">Banner</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="NATIVE">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={forecastParams.startDate}
                    onChange={(e) => setForecastParams(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={forecastParams.endDate}
                    onChange={(e) => setForecastParams(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={generateForecast} disabled={loading} className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate Forecast"}
              </Button>
            </CardContent>
          </Card>

          {forecast && (
            <Card>
              <CardHeader>
                <CardTitle>Forecast Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {forecast.estimatedImpressions.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Impressions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {forecast.estimatedReach.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Reach
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${forecast.recommendedBudget.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Recommended Budget
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {forecast.confidence}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Confidence Level
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Premium (80-100%)</span>
                    <span className="text-green-600 font-medium">
                      {inventory.filter(i => i.quality.score >= 80).length} items
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Standard (60-79%)</span>
                    <span className="text-yellow-600 font-medium">
                      {inventory.filter(i => i.quality.score >= 60 && i.quality.score < 80).length} items
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Basic (0-59%)</span>
                    <span className="text-red-600 font-medium">
                      {inventory.filter(i => i.quality.score < 60).length} items
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['MOBILE', 'DESKTOP', 'TABLET', 'CTV'].map(device => (
                    <div key={device} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {getDeviceIcon(device)}
                        {device}
                      </span>
                      <span className="font-medium">
                        {inventory.filter(i => i.deviceType === device).length} items
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
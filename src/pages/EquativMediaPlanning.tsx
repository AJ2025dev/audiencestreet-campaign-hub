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
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Target, TrendingUp, Zap, BarChart3, Download } from "lucide-react";

interface MediaPlan {
  id: string;
  name: string;
  description: string;
  totalBudget: number;
  currency: string;
  startDate: string;
  endDate: string;
  channels: string[];
  objectives: string[];
  status: string;
}

interface OptimizationResult {
  recommendedAllocation: {
    channel: string;
    budget: number;
    expectedReach: number;
    expectedImpressions: number;
  }[];
  totalReach: number;
  efficiency: number;
}

export default function EquativMediaPlanning() {
  const [mediaPlans, setMediaPlans] = useState<MediaPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MediaPlan | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    totalBudget: "",
    currency: "USD",
    startDate: "",
    endDate: "",
    objectives: [] as string[],
    channels: [] as string[]
  });

  const availableObjectives = [
    { id: "reach", label: "Maximize Reach" },
    { id: "frequency", label: "Optimize Frequency" },
    { id: "efficiency", label: "Cost Efficiency" },
    { id: "engagement", label: "Drive Engagement" },
    { id: "conversions", label: "Generate Conversions" }
  ];

  const availableChannels = [
    { id: "display", label: "Display Advertising" },
    { id: "video", label: "Video Advertising" },
    { id: "native", label: "Native Advertising" },
    { id: "audio", label: "Audio Advertising" },
    { id: "ctv", label: "Connected TV" },
    { id: "social", label: "Social Media" }
  ];

  useEffect(() => {
    // Simulate loading media plans
    setMediaPlans([
      {
        id: "1",
        name: "Q1 Brand Awareness Campaign",
        description: "Multi-channel brand awareness push for Q1",
        totalBudget: 50000,
        currency: "USD",
        startDate: "2024-01-01",
        endDate: "2024-03-31",
        channels: ["display", "video", "native"],
        objectives: ["reach", "frequency"],
        status: "active"
      },
      {
        id: "2", 
        name: "Product Launch Media Mix",
        description: "Integrated campaign for new product launch",
        totalBudget: 75000,
        currency: "USD",
        startDate: "2024-02-15",
        endDate: "2024-05-15",
        channels: ["video", "ctv", "social"],
        objectives: ["reach", "conversions"],
        status: "draft"
      }
    ]);
  }, []);

  const createMediaPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-media-planning', {
        body: {
          action: 'create_media_plan',
          planData: {
            ...newPlan,
            totalBudget: parseFloat(newPlan.totalBudget)
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Media Plan Created",
        description: `Media plan "${newPlan.name}" has been created successfully.`,
      });

      setNewPlan({
        name: "",
        description: "",
        totalBudget: "",
        currency: "USD",
        startDate: "",
        endDate: "",
        objectives: [],
        channels: []
      });
      setIsCreateDialogOpen(false);
      
      // Add to local state for demo
      setMediaPlans(prev => [...prev, {
        id: Date.now().toString(),
        ...newPlan,
        totalBudget: parseFloat(newPlan.totalBudget),
        status: "draft"
      }]);
    } catch (error: any) {
      toast({
        title: "Error creating media plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const optimizePlan = async (planId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-media-planning', {
        body: {
          action: 'optimize_media_plan',
          planId,
          planData: {
            objectives: ["reach", "efficiency"],
            constraints: {},
            preferences: {}
          }
        }
      });

      if (error) throw error;
      
      // Simulate optimization results
      setOptimization({
        recommendedAllocation: [
          { channel: "Display", budget: 20000, expectedReach: 1500000, expectedImpressions: 5000000 },
          { channel: "Video", budget: 25000, expectedReach: 800000, expectedImpressions: 2500000 },
          { channel: "Native", budget: 5000, expectedReach: 300000, expectedImpressions: 800000 }
        ],
        totalReach: 2600000,
        efficiency: 87
      });
      
      toast({
        title: "Optimization Complete",
        description: "Media plan has been optimized successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error optimizing plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleObjectiveChange = (objectiveId: string, checked: boolean) => {
    setNewPlan(prev => ({
      ...prev,
      objectives: checked 
        ? [...prev.objectives, objectiveId]
        : prev.objectives.filter(id => id !== objectiveId)
    }));
  };

  const handleChannelChange = (channelId: string, checked: boolean) => {
    setNewPlan(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, channelId]
        : prev.channels.filter(id => id !== channelId)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equativ Media Planning</h1>
          <p className="text-muted-foreground">Create and optimize cross-channel media strategies</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Media Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Media Plan</DialogTitle>
              <DialogDescription>
                Set up a comprehensive cross-channel media strategy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter plan name"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your media plan objectives"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="totalBudget">Total Budget</Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    value={newPlan.totalBudget}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, totalBudget: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={newPlan.currency} 
                    onValueChange={(value) => setNewPlan(prev => ({ ...prev, currency: value }))}
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
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newPlan.startDate}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newPlan.endDate}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Campaign Objectives</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableObjectives.map((objective) => (
                    <div key={objective.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={objective.id}
                        checked={newPlan.objectives.includes(objective.id)}
                        onCheckedChange={(checked) => handleObjectiveChange(objective.id, checked as boolean)}
                      />
                      <Label htmlFor={objective.id} className="text-sm">
                        {objective.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Media Channels</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel.id}
                        checked={newPlan.channels.includes(channel.id)}
                        onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                      />
                      <Label htmlFor={channel.id} className="text-sm">
                        {channel.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={createMediaPlan} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Media Plan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Media Plans</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">
                        {plan.currency} {plan.totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Start: {new Date(plan.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(plan.endDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Objectives:</div>
                      <div className="flex flex-wrap gap-1">
                        {plan.objectives.map((obj) => (
                          <Badge key={obj} variant="outline" className="text-xs">
                            {availableObjectives.find(o => o.id === obj)?.label || obj}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Channels:</div>
                      <div className="flex flex-wrap gap-1">
                        {plan.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {availableChannels.find(c => c.id === channel)?.label || channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => optimizePlan(plan.id)}
                        className="flex-1"
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Optimize
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <BarChart3 className="mr-1 h-3 w-3" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {optimization ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Optimization Results
                  </CardTitle>
                  <CardDescription>
                    AI-powered budget allocation recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {optimization.totalReach.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Estimated Reach
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {optimization.efficiency}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Efficiency Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {optimization.recommendedAllocation.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Channels Optimized
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Recommended Budget Allocation</h4>
                    {optimization.recommendedAllocation.map((allocation, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{allocation.channel}</div>
                            <div className="text-sm text-muted-foreground">
                              Reach: {allocation.expectedReach.toLocaleString()} | 
                              Impressions: {allocation.expectedImpressions.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              ${allocation.budget.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((allocation.budget / 50000) * 100)}% of budget
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No optimization results yet</p>
                <Button onClick={() => optimizePlan("1")}>
                  <Zap className="mr-2 h-4 w-4" />
                  Run Optimization
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Reach & Frequency Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                Forecasting capabilities will be available once a media plan is optimized
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
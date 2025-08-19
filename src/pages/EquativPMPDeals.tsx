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
import { Handshake, Search, CheckCircle, XCircle, Pause, Play, TrendingUp } from "lucide-react";

interface PMPDeal {
  id: string;
  name: string;
  publisherId: string;
  publisherName: string;
  dealType: string;
  status: string;
  pricing: {
    type: string;
    amount: number;
    currency: string;
    floorPrice?: number;
  };
  inventory: {
    adFormats: string[];
    geography: string[];
    category: string;
  };
  performance?: {
    impressions: number;
    spend: number;
    ctr: number;
  };
  startDate: string;
  endDate: string;
}

interface DealNegotiation {
  dealId: string;
  proposedPrice: number;
  terms: string;
  status: string;
}

export default function EquativPMPDeals() {
  const [deals, setDeals] = useState<PMPDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<PMPDeal | null>(null);
  const [negotiations, setNegotiations] = useState<DealNegotiation[]>([]);
  const [isNegotiateDialogOpen, setIsNegotiateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    status: "",
    publisherId: "",
    adFormat: "",
    geography: ""
  });

  const [negotiationData, setNegotiationData] = useState({
    proposedPrice: "",
    terms: "",
    reason: ""
  });

  useEffect(() => {
    loadDeals();
  }, [filters]);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-pmp-deals', {
        body: { 
          action: 'list_available_deals',
          dealData: filters
        }
      });

      if (error) throw error;
      
      // Simulate deal data for demo
      setDeals([
        {
          id: "deal_001",
          name: "Premium Sports Inventory",
          publisherId: "pub_sports_net",
          publisherName: "Sports Network Media",
          dealType: "PREFERRED",
          status: "AVAILABLE",
          pricing: {
            type: "CPM",
            amount: 15.50,
            currency: "USD",
            floorPrice: 12.00
          },
          inventory: {
            adFormats: ["BANNER", "VIDEO"],
            geography: ["US", "CA"],
            category: "SPORTS"
          },
          startDate: "2024-03-01",
          endDate: "2024-05-31"
        },
        {
          id: "deal_002", 
          name: "News Premium Placement",
          publisherId: "pub_news_corp",
          publisherName: "News Corporation",
          dealType: "GUARANTEED",
          status: "ACTIVE",
          pricing: {
            type: "CPM",
            amount: 22.00,
            currency: "USD"
          },
          inventory: {
            adFormats: ["NATIVE", "BANNER"],
            geography: ["US", "UK"],
            category: "NEWS"
          },
          performance: {
            impressions: 2500000,
            spend: 55000,
            ctr: 1.2
          },
          startDate: "2024-02-15",
          endDate: "2024-04-15"
        },
        {
          id: "deal_003",
          name: "Entertainment Video Package",
          publisherId: "pub_entertainment",
          publisherName: "Entertainment Studios",
          dealType: "AUCTION",
          status: "PENDING_APPROVAL",
          pricing: {
            type: "CPM",
            amount: 18.75,
            currency: "USD",
            floorPrice: 15.00
          },
          inventory: {
            adFormats: ["VIDEO", "CTV"],
            geography: ["US"],
            category: "ENTERTAINMENT"
          },
          startDate: "2024-04-01",
          endDate: "2024-06-30"
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error loading deals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const negotiateDeal = async (dealId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-pmp-deals', {
        body: {
          action: 'negotiate_deal',
          dealData: {
            dealId,
            proposedPrice: parseFloat(negotiationData.proposedPrice),
            currency: "USD",
            terms: negotiationData.terms
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Negotiation Submitted",
        description: "Your deal negotiation has been submitted for review.",
      });

      setNegotiationData({ proposedPrice: "", terms: "", reason: "" });
      setIsNegotiateDialogOpen(false);
      
      // Add to negotiations list
      setNegotiations(prev => [...prev, {
        dealId,
        proposedPrice: parseFloat(negotiationData.proposedPrice),
        terms: negotiationData.terms,
        status: "PENDING"
      }]);
    } catch (error: any) {
      toast({
        title: "Error submitting negotiation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptDeal = async (dealId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-pmp-deals', {
        body: {
          action: 'accept_deal',
          dealId,
          dealData: { terms: {}, budget: 50000 }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Deal Accepted",
        description: "The PMP deal has been accepted and activated.",
      });
      
      // Update deal status
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? { ...deal, status: 'ACTIVE' } : deal
      ));
    } catch (error: any) {
      toast({
        title: "Error accepting deal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pauseDeal = async (dealId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('equativ-pmp-deals', {
        body: { action: 'pause_deal', dealId }
      });

      if (error) throw error;
      
      toast({
        title: "Deal Paused",
        description: "The PMP deal has been paused.",
      });
      
      // Update deal status
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? { ...deal, status: 'PAUSED' } : deal
      ));
    } catch (error: any) {
      toast({
        title: "Error pausing deal",
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
      case 'AVAILABLE': return 'bg-blue-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'PENDING_APPROVAL': return 'bg-orange-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'PREFERRED': return 'bg-purple-500';
      case 'GUARANTEED': return 'bg-green-500';
      case 'AUCTION': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equativ PMP Deals</h1>
          <p className="text-muted-foreground">Manage private marketplace deals and negotiations</p>
        </div>
        <Button onClick={loadDeals} disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? "Searching..." : "Search Deals"}
        </Button>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Deals</TabsTrigger>
          <TabsTrigger value="active">Active Deals</TabsTrigger>
          <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter Deals</CardTitle>
              <CardDescription>
                Find the most relevant private marketplace opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Status</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
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
                      <SelectValue placeholder="Any format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Format</SelectItem>
                      <SelectItem value="BANNER">Banner</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="NATIVE">Native</SelectItem>
                      <SelectItem value="CTV">Connected TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="geography">Geography</Label>
                  <Select 
                    value={filters.geography} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, geography: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any geography" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Geography</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publisherId">Publisher</Label>
                  <Input
                    id="publisherId"
                    value={filters.publisherId}
                    onChange={(e) => setFilters(prev => ({ ...prev, publisherId: e.target.value }))}
                    placeholder="Publisher ID"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.filter(deal => deal.status === 'AVAILABLE' || deal.status === 'PENDING_APPROVAL').map((deal) => (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{deal.name}</CardTitle>
                      <CardDescription>{deal.publisherName}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(deal.status)}>
                        {deal.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getDealTypeColor(deal.dealType)}>
                        {deal.dealType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {deal.pricing.currency} {deal.pricing.amount} {deal.pricing.type}
                      </span>
                    </div>
                    {deal.pricing.floorPrice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Floor Price:</span>
                        <span className="font-medium">
                          {deal.pricing.currency} {deal.pricing.floorPrice}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Ad Formats:</div>
                      <div className="flex flex-wrap gap-1">
                        {deal.inventory.adFormats.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Geography:</div>
                      <div className="flex flex-wrap gap-1">
                        {deal.inventory.geography.map((geo) => (
                          <Badge key={geo} variant="secondary" className="text-xs">
                            {geo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Start: {new Date(deal.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(deal.endDate).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => acceptDeal(deal.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Accept
                      </Button>
                      <Dialog open={isNegotiateDialogOpen} onOpenChange={setIsNegotiateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedDeal(deal)}
                          >
                            <Handshake className="mr-1 h-3 w-3" />
                            Negotiate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Negotiate Deal</DialogTitle>
                            <DialogDescription>
                              Submit a counter-offer for {selectedDeal?.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="proposedPrice">Proposed Price ({selectedDeal?.pricing.currency})</Label>
                              <Input
                                id="proposedPrice"
                                type="number"
                                step="0.01"
                                value={negotiationData.proposedPrice}
                                onChange={(e) => setNegotiationData(prev => ({ ...prev, proposedPrice: e.target.value }))}
                                placeholder={`Current: ${selectedDeal?.pricing.amount}`}
                              />
                            </div>
                            <div>
                              <Label htmlFor="terms">Additional Terms</Label>
                              <Textarea
                                id="terms"
                                value={negotiationData.terms}
                                onChange={(e) => setNegotiationData(prev => ({ ...prev, terms: e.target.value }))}
                                placeholder="Describe any additional terms or requirements"
                                rows={3}
                              />
                            </div>
                            <Button 
                              onClick={() => selectedDeal && negotiateDeal(selectedDeal.id)} 
                              disabled={loading} 
                              className="w-full"
                            >
                              {loading ? "Submitting..." : "Submit Negotiation"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.filter(deal => deal.status === 'ACTIVE').map((deal) => (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{deal.name}</CardTitle>
                      <CardDescription>{deal.publisherName}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deal.performance && (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold">{deal.performance.impressions.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">${deal.performance.spend.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Spend</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{deal.performance.ctr}%</div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {deal.pricing.currency} {deal.pricing.amount} {deal.pricing.type}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pauseDeal(deal.id)}
                        className="flex-1"
                      >
                        <Pause className="mr-1 h-3 w-3" />
                        Pause
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="negotiations" className="space-y-4">
          {negotiations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Handshake className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active negotiations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {negotiations.map((negotiation, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Deal Negotiation</CardTitle>
                    <CardDescription>Deal ID: {negotiation.dealId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Proposed Price: ${negotiation.proposedPrice}</div>
                        <div className="text-sm text-muted-foreground">{negotiation.terms}</div>
                      </div>
                      <Badge variant={negotiation.status === 'PENDING' ? 'secondary' : 'default'}>
                        {negotiation.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Play,
  Pause,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CampaignRow {
  id: string;
  user_id: string;
  agency_id?: string | null;
  name: string;
  description?: string | null;
  budget: number;
  daily_budget?: number | null;
  start_date: string; // ISO
  end_date?: string | null;
  status: string; // 'draft' | 'active' | 'paused'
  created_at: string;
  updated_at: string;
}

const Campaigns = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "paused":
        return "bg-warning";
      case "draft":
        return "bg-muted";
      default:
        return "bg-secondary";
    }
  };

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<CampaignRow[]> => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CampaignRow[];
    },
  });

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    const q = search.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter((c) => c.name.toLowerCase().includes(q));
  }, [campaigns, search]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: string }) => {
      const { error } = await supabase.rpc("update_campaign_status", {
        p_campaign_id: id,
        p_status: next,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns", user?.id] });
      toast.success("Campaign status updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns", user?.id] });
      toast.success("Campaign deleted");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to delete"),
  });

  const [editing, setEditing] = useState<CampaignRow | null>(null);
  const [form, setForm] = useState({
    budget: "",
    daily_budget: "",
    start_date: "",
    end_date: "",
  });
  
  const autoCampaignMutation = useMutation({
    mutationFn: async (campaign: CampaignRow) => {
      // Generate AI strategy
      const { data: strategyData, error: strategyError } = await supabase.functions.invoke('generate-campaign-strategy', {
        body: {
          brandDescription: `Campaign: ${campaign.name}`,
          campaignObjective: "Optimize performance based on existing campaign data",
          platformContext: {
            budget: `Total: ${campaign.budget}, Daily: ${campaign.daily_budget || 'Not set'}`,
            startDate: campaign.start_date,
            endDate: campaign.end_date || 'Not set'
          }
        }
      });
      
      if (strategyError) throw strategyError;
      
      // Create new auto campaign with AI strategy
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: `${campaign.name} (Auto)`,
          budget: campaign.budget,
          daily_budget: campaign.daily_budget,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          status: 'draft',
          user_id: user!.id,
          description: `Auto-generated campaign based on "${campaign.name}" with AI strategy: ${strategyData.strategy.substring(0, 200)}...`
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns", user?.id] });
      toast.success("Auto campaign created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create auto campaign: ${error.message}`);
    },
  });

  const openEdit = (c: CampaignRow) => {
    setEditing(c);
    setForm({
      budget: String(c.budget ?? ""),
      daily_budget: String(c.daily_budget ?? ""),
      start_date: c.start_date?.slice(0, 10) ?? "",
      end_date: c.end_date ? c.end_date.slice(0, 10) : "",
    });
  };

  const budgetMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const budget = Number(form.budget);
      const daily = form.daily_budget ? Number(form.daily_budget) : null;
      const start = form.start_date ? new Date(form.start_date).toISOString() : null;
      const end = form.end_date ? new Date(form.end_date).toISOString() : null;

      if (!isFinite(budget) || budget < 0) throw new Error("Invalid budget");
      if (daily !== null && (!isFinite(daily) || daily < 0)) throw new Error("Invalid daily budget");
      if (!start) throw new Error("Start date is required");
      if (end && new Date(end) < new Date(start)) throw new Error("End date must be after start date");

      const { error } = await supabase.rpc("update_campaign_budget", {
        p_campaign_id: editing.id,
        p_budget: budget,
        p_daily_budget: daily,
        p_start_date: start,
        p_end_date: end,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["campaigns", user?.id] });
      toast.success("Campaign updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update campaign"),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">Manage and monitor your advertising campaigns</p>
        </div>
        <Button variant="gradient" className="gap-2" onClick={() => navigate("/campaigns/create")}> 
          <PlusCircle className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search campaigns..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Daily</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Start</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">End</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="py-6 px-4 text-muted-foreground" colSpan={7}>Loading campaigns...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="py-6 px-4 text-muted-foreground" colSpan={7}>No campaigns found</td>
                  </tr>
                ) : (
                  filtered.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-foreground">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.description ?? ""}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-medium">${"" + Number(campaign.budget ?? 0).toLocaleString()}</td>
                      <td className="py-4 px-4 font-medium">{campaign.daily_budget ? `$${Number(campaign.daily_budget).toLocaleString()}` : "—"}</td>
                      <td className="py-4 px-4">{campaign.start_date?.slice(0, 10)}</td>
                      <td className="py-4 px-4">{campaign.end_date ? campaign.end_date.slice(0, 10) : "—"}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              statusMutation.mutate({
                                id: campaign.id,
                                next: campaign.status === "active" ? "paused" : "active",
                              })
                            }
                            disabled={statusMutation.isPending}
                            aria-label={campaign.status === "active" ? "Pause" : "Resume"}
                          >
                            {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => autoCampaignMutation.mutate(campaign)}
                            disabled={autoCampaignMutation.isPending}
                            aria-label="Create Auto Campaign"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => openEdit(campaign)}>
                                <Edit className="h-4 w-4" />
                                Edit Budget/Dates
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => deleteMutation.mutate(campaign.id)}>
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <Input id="budget" inputMode="decimal" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="daily_budget">Daily Budget ($)</Label>
                <Input id="daily_budget" inputMode="decimal" value={form.daily_budget} onChange={(e) => setForm((f) => ({ ...f, daily_budget: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => budgetMutation.mutate()} disabled={budgetMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;

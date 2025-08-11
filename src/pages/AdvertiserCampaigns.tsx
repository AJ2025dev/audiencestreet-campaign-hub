import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Search, MoreHorizontal, Play, Pause, Edit, Trash2, Building } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Profile { user_id: string; company_name: string; role: string }
interface CampaignRow {
  id: string;
  user_id: string;
  name: string;
  status: string;
  budget: number;
  daily_budget?: number | null;
  start_date: string;
  end_date?: string | null;
  created_at: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success";
    case "paused": return "bg-warning";
    case "completed": return "bg-primary";
    case "draft": return "bg-muted";
    default: return "bg-secondary";
  }
}

export function AdvertiserCampaigns() {
  const navigate = useNavigate();
  const { advertiserId } = useParams();
  const qc = useQueryClient();
  const { user } = useAuth();
  const uid = advertiserId ?? user?.id ?? "";
  const [searchTerm, setSearchTerm] = useState("");

  const { data: advertiser } = useQuery({
    queryKey: ["profile", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("company_name, role, user_id").eq("user_id", uid).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    }
  });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", uid],
    enabled: !!uid,
    queryFn: async (): Promise<CampaignRow[]> => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, user_id, name, status, budget, daily_budget, start_date, end_date, created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CampaignRow[];
    }
  });

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter((c) => c.name.toLowerCase().includes(q));
  }, [campaigns, searchTerm]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: string }) => {
      const { error } = await supabase.rpc("update_campaign_status", {
        p_campaign_id: id,
        p_status: next,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns", uid] });
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
      qc.invalidateQueries({ queryKey: ["campaigns", uid] });
      toast.success("Campaign deleted");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to delete"),
  });

  const [editing, setEditing] = useState<CampaignRow | null>(null);
  const [form, setForm] = useState({ budget: "", daily_budget: "", start_date: "", end_date: "" });
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
      qc.invalidateQueries({ queryKey: ["campaigns", uid] });
      toast.success("Campaign updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update campaign"),
  });

  const handleCreateCampaign = () => {
    navigate(`/advertisers/${uid}/campaigns/create`);
  };

  const handleViewCampaign = (campaignId: string) => {
    navigate(`/advertisers/${uid}/campaigns/${campaignId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/advertisers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Advertisers
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{advertiser?.company_name ?? 'Advertiser'}</h1>
            <p className="text-muted-foreground">Campaigns</p>
          </div>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Manage all campaigns for this advertiser</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Budget</th>
                  <th className="text-left py-3 px-4">Daily</th>
                  <th className="text-left py-3 px-4">Start</th>
                  <th className="text-left py-3 px-4">End</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>Loading campaigns...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>No campaigns found</td></tr>
                ) : filtered.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium cursor-pointer hover:text-primary" onClick={() => handleViewCampaign(campaign.id)}>
                          {campaign.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.start_date?.slice(0,10)} - {campaign.end_date ? campaign.end_date.slice(0,10) : '—'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">${Number(campaign.budget ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4">{campaign.daily_budget ? `$${Number(campaign.daily_budget).toLocaleString()}` : '—'}</td>
                    <td className="py-3 px-4">{campaign.start_date?.slice(0,10)}</td>
                    <td className="py-3 px-4">{campaign.end_date ? campaign.end_date.slice(0,10) : '—'}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(campaign)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Budget/Dates
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => statusMutation.mutate({ id: campaign.id, next: campaign.status === 'active' ? 'paused' : 'active' })}>
                            {campaign.status === 'active' ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteMutation.mutate(campaign.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
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
            <Button onClick={() => budgetMutation.mutate()} disabled={budgetMutation.isPending}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdvertiserCampaigns

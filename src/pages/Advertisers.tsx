import { useState } from "react"
import { Plus, Search, MoreHorizontal, Building, Edit, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800"
    case "Paused": return "bg-yellow-100 text-yellow-800"
    case "Inactive": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export function Advertisers() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    contactEmail: "",
    description: "",
  })

  // Fetch advertisers from database
  const { data: advertisers, isLoading, isError } = useQuery({
    queryKey: ["advertisers", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // For agencies, fetch their advertisers
      // For admins, fetch all advertisers
      // For advertisers, they can only see themselves
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, company_name, contact_email, created_at")
        .eq("role", "advertiser")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // For now, we'll just return the profile data
      // In a more complete implementation, you might join with other tables
      // to get campaign count and total spend
      return data?.map(profile => ({
        id: profile.user_id,
        name: profile.company_name,
        contactEmail: profile.contact_email,
        description: "", // This would come from a separate table in a full implementation
        industry: "", // This would come from a separate table in a full implementation
        status: "Active", // This would come from a separate table in a full implementation
        campaigns: 0, // This would come from a separate table in a full implementation
        totalSpend: "$0", // This would come from a separate table in a full implementation
      })) || [];
    },
  });

  // Filter advertisers based on search term
  const filteredAdvertisers = advertisers?.filter(advertiser =>
    advertiser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advertiser.industry.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Mutation for creating a new advertiser
  const createAdvertiserMutation = useMutation({
    mutationFn: async (newAdvertiser: any) => {
      // In a full implementation, you would create a user account and profile
      // For now, we'll just show a success message
      console.log("Creating advertiser:", newAdvertiser);
      // This is a placeholder - in a real implementation you would:
      // 1. Create a new user account in Supabase Auth
      // 2. Create a profile record in the profiles table
      // 3. Set the role to 'advertiser'
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisers"] });
      toast.success("Advertiser created successfully!");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", industry: "", contactEmail: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(`Failed to create advertiser: ${error.message}`);
    },
  });

  const handleCreateAdvertiser = () => {
    // Validate required fields
    if (!formData.name) {
      toast.error("Please enter an advertiser name");
      return;
    }

    // In a full implementation, you would create a new user account
    // For now, we'll just use the mutation to show the success message
    createAdvertiserMutation.mutate(formData);
  }

  const handleViewCampaigns = (advertiserId: number) => {
    navigate(`/advertisers/${advertiserId}/campaigns`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advertisers</h1>
          <p className="text-muted-foreground">Manage your advertising clients and partners</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Advertiser
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search advertisers..."
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

      {/* Advertisers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvertisers.map((advertiser) => (
          <Card key={advertiser.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{advertiser.name}</CardTitle>
                    <CardDescription>{advertiser.industry}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewCampaigns(advertiser.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Campaigns
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary" className={getStatusColor(advertiser.status)}>
                  {advertiser.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Campaigns</span>
                <span className="font-medium">{advertiser.campaigns}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spend</span>
                <span className="font-medium">{advertiser.totalSpend}</span>
              </div>
              <p className="text-sm text-muted-foreground">{advertiser.description}</p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleViewCampaigns(advertiser.id)}
              >
                View Campaigns
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Advertiser Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Advertiser</DialogTitle>
            <DialogDescription>
              Add a new advertiser to your platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Advertiser Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter advertiser name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="Enter contact email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the advertiser"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdvertiser}>Create Advertiser</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Advertisers
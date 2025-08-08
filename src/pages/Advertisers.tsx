import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Building, Edit, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

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

import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

// Type definitions for advertiser profile with aggregated stats
interface Advertiser {
  id: string
  user_id: string
  company_name: string
  contact_email: string | null
  campaignsCount: number
  totalSpend: number
}

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
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    description: "",
  })
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch advertisers and compute stats on mount
  useEffect(() => {
    const fetchAdvertisers = async () => {
      if (!user) return
      try {
        // Get all profiles with role 'advertiser'
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, user_id, company_name, contact_email, role')
          .eq('role', 'advertiser')

        if (profilesError) throw profilesError

        // For each advertiser compute campaigns count and spend
        const advertisersWithStats: Advertiser[] = await Promise.all(
          (profiles || []).map(async (p: any) => {
            let campaignsCount = 0
            let totalSpend = 0
            // Fetch campaigns for this advertiser
            const { data: campaigns, error: campaignsError } = await supabase
              .from('campaigns')
              .select('id, budget')
              .eq('user_id', p.user_id)

            if (!campaignsError && campaigns) {
              campaignsCount = campaigns.length
              totalSpend = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0)
            }
            return {
              id: p.id,
              user_id: p.user_id,
              company_name: p.company_name,
              contact_email: p.contact_email,
              campaignsCount,
              totalSpend,
            }
          })
        )
        setAdvertisers(advertisersWithStats)
      } catch (err) {
        console.error('Error fetching advertisers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvertisers()
  }, [user])

  const filteredAdvertisers = advertisers.filter(advertiser =>
    advertiser.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (advertiser.contact_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateAdvertiser = async () => {
    // Note: creating an advertiser means creating a profile with role 'advertiser'.
    // This simplified implementation does not create an associated Supabase user.
    try {
      const { error } = await supabase.from('profiles').insert({
        company_name: formData.companyName,
        contact_email: formData.contactEmail,
        role: 'advertiser',
        user_id: user?.id || '',
        // Additional fields like description can be stored in a separate table
      })
      if (error) throw error
      // Refetch advertisers list
      setFormData({ companyName: '', contactEmail: '', description: '' })
      setIsCreateDialogOpen(false)
      // Note: we call fetchAdvertisers again by updating effect dependencies
      setLoading(true)
      // Immediately fetch new list
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, user_id, company_name, contact_email, role')
        .eq('role', 'advertiser')
      // Skip computing campaigns for brevity; use current campaigns data
      if (profiles) {
        const advertisersWithStats: Advertiser[] = await Promise.all(
          profiles.map(async (p: any) => {
            let campaignsCount = 0
            let totalSpend = 0
            const { data: campaigns } = await supabase
              .from('campaigns')
              .select('id, budget')
              .eq('user_id', p.user_id)
            if (campaigns) {
              campaignsCount = campaigns.length
              totalSpend = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0)
            }
            return {
              id: p.id,
              user_id: p.user_id,
              company_name: p.company_name,
              contact_email: p.contact_email,
              campaignsCount,
              totalSpend,
            }
          })
        )
        setAdvertisers(advertisersWithStats)
      }
    } catch (err) {
      console.error('Error creating advertiser:', err)
    }
  }

  const handleViewCampaigns = (advertiserUserId: string) => {
    navigate(`/advertisers/${advertiserUserId}/campaigns`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
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
                    <CardTitle className="text-lg">{advertiser.company_name}</CardTitle>
                    <CardDescription>{advertiser.contact_email || 'No contact'}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewCampaigns(advertiser.user_id)}>
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
                {/* In a real application advertiser statuses could be stored in a separate field. */}
                <Badge className={getStatusColor('Active')}>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Campaigns</span>
                <span className="font-medium">{advertiser.campaignsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spend</span>
                <span className="font-medium">${advertiser.totalSpend.toLocaleString()}</span>
              </div>
              {/* Additional description could be shown here if stored */}
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
              <Label htmlFor="companyName">Advertiser Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter advertiser name"
              />
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
import { useState } from "react"
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

// Mock data for advertisers
const advertisersData = [
  {
    id: 1,
    name: "TechCorp Solutions",
    industry: "Technology",
    status: "Active",
    campaigns: 12,
    totalSpend: "$125,000",
    contactEmail: "marketing@techcorp.com",
    description: "Leading technology solutions provider",
  },
  {
    id: 2,
    name: "Fashion Forward",
    industry: "Retail",
    status: "Active", 
    campaigns: 8,
    totalSpend: "$89,500",
    contactEmail: "ads@fashionforward.com",
    description: "Trendy fashion and lifestyle brand",
  },
  {
    id: 3,
    name: "EcoGreen Products",
    industry: "Environment",
    status: "Paused",
    campaigns: 3,
    totalSpend: "$45,200",
    contactEmail: "green@ecogreen.com", 
    description: "Sustainable and eco-friendly products",
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    contactEmail: "",
    description: "",
  })

  const filteredAdvertisers = advertisersData.filter(advertiser =>
    advertiser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advertiser.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateAdvertiser = () => {
    console.log("Creating advertiser:", formData)
    setIsCreateDialogOpen(false)
    setFormData({ name: "", industry: "", contactEmail: "", description: "" })
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
                <Badge className={getStatusColor(advertiser.status)}>
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
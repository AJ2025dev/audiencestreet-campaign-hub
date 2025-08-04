import { useState } from "react"
import { ArrowLeft, Plus, Search, MoreHorizontal, Play, Pause, Edit, Copy, Trash2, Building } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

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

// Mock data
const advertiserData = {
  1: { name: "TechCorp Solutions", industry: "Technology" },
  2: { name: "Fashion Forward", industry: "Retail" },
  3: { name: "EcoGreen Products", industry: "Environment" },
}

const campaignsData = [
  {
    id: 1,
    name: "Summer Tech Sale 2024",
    status: "Active",
    budget: "$25,000",
    spend: "$18,450",
    impressions: "2.4M",
    clicks: "48K",
    ctr: "2.0%",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    advertiserId: 1,
  },
  {
    id: 2,
    name: "Back to School Campaign",
    status: "Paused",
    budget: "$15,000",
    spend: "$12,300",
    impressions: "1.8M",
    clicks: "32K",
    ctr: "1.8%",
    startDate: "2024-07-15",
    endDate: "2024-09-15",
    advertiserId: 1,
  },
  {
    id: 3,
    name: "Fashion Week Promo",
    status: "Active",
    budget: "$30,000",
    spend: "$22,100",
    impressions: "3.1M",
    clicks: "65K",
    ctr: "2.1%",
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    advertiserId: 2,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800"
    case "Paused": return "bg-yellow-100 text-yellow-800"
    case "Completed": return "bg-blue-100 text-blue-800"
    case "Draft": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export function AdvertiserCampaigns() {
  const navigate = useNavigate()
  const { advertiserId } = useParams()
  const [searchTerm, setSearchTerm] = useState("")

  const advertiser = advertiserData[parseInt(advertiserId || "1") as keyof typeof advertiserData]
  const advertiserCampaigns = campaignsData.filter(campaign => 
    campaign.advertiserId === parseInt(advertiserId || "1") &&
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCampaign = () => {
    navigate(`/advertisers/${advertiserId}/campaigns/create`)
  }

  const handleViewCampaign = (campaignId: number) => {
    navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}`)
  }

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
            <h1 className="text-3xl font-bold">{advertiser?.name}</h1>
            <p className="text-muted-foreground">{advertiser?.industry} • Campaigns</p>
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
                  <th className="text-left py-3 px-4">Spend</th>
                  <th className="text-left py-3 px-4">Impressions</th>
                  <th className="text-left py-3 px-4">Clicks</th>
                  <th className="text-left py-3 px-4">CTR</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {advertiserCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium cursor-pointer hover:text-primary" 
                             onClick={() => handleViewCampaign(campaign.id)}>
                          {campaign.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.startDate} - {campaign.endDate}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{campaign.budget}</td>
                    <td className="py-3 px-4">{campaign.spend}</td>
                    <td className="py-3 px-4">{campaign.impressions}</td>
                    <td className="py-3 px-4">{campaign.clicks}</td>
                    <td className="py-3 px-4">{campaign.ctr}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCampaign(campaign.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            View/Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {campaign.status === "Active" ? (
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
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
    </div>
  )
}

export default AdvertiserCampaigns
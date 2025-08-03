import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  PlusCircle,
  Play,
  Pause,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Edit,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

const campaignsData = [
  {
    id: 1,
    name: "Q1 Brand Awareness Campaign",
    status: "active",
    budget: "$10,000",
    spent: "$8,450",
    impressions: "1.2M",
    clicks: "24.5K",
    ctr: "2.04%",
    cpm: "$7.04",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    objective: "Brand Awareness"
  },
  {
    id: 2,
    name: "Holiday Retargeting Campaign",
    status: "paused",
    budget: "$7,500",
    spent: "$6,230",
    impressions: "890K",
    clicks: "18.2K",
    ctr: "2.04%",
    cpm: "$6.99",
    startDate: "2023-12-01",
    endDate: "2024-01-15",
    objective: "Conversions"
  },
  {
    id: 3,
    name: "Mobile App Install Campaign",
    status: "active",
    budget: "$15,000",
    spent: "$12,890",
    impressions: "2.1M",
    clicks: "45.6K",
    ctr: "2.17%",
    cpm: "$6.14",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    objective: "App Installs"
  },
  {
    id: 4,
    name: "Summer Product Launch",
    status: "draft",
    budget: "$20,000",
    spent: "$0",
    impressions: "0",
    clicks: "0",
    ctr: "0%",
    cpm: "$0",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    objective: "Traffic"
  }
]

const Campaigns = () => {
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success"
      case "paused": return "bg-warning"
      case "draft": return "bg-muted"
      default: return "bg-secondary"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">Manage and monitor your advertising campaigns</p>
        </div>
        <Button 
          variant="gradient" 
          className="gap-2"
          onClick={() => navigate('/campaigns/create')}
        >
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
              <Input 
                placeholder="Search campaigns..." 
                className="pl-10"
              />
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">CPM</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaignsData.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-foreground">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.objective}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary"
                        className={getStatusColor(campaign.status)}
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-medium">{campaign.budget}</td>
                    <td className="py-4 px-4 font-medium">{campaign.spent}</td>
                    <td className="py-4 px-4">{campaign.impressions}</td>
                    <td className="py-4 px-4">{campaign.clicks}</td>
                    <td className="py-4 px-4">{campaign.ctr}</td>
                    <td className="py-4 px-4">{campaign.cpm}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          {campaign.status === "active" ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Play className="h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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

export default Campaigns
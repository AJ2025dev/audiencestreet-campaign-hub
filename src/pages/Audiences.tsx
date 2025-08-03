import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const audienceData = [
  {
    id: 1,
    name: "High-Value Customers",
    type: "Custom",
    size: "2.5M",
    source: "Customer Data",
    status: "active",
    campaigns: 3,
    performance: "+15.2%"
  },
  {
    id: 2,
    name: "Website Visitors (30 days)",
    type: "Retargeting",
    size: "450K",
    source: "Website Pixel",
    status: "active",
    campaigns: 5,
    performance: "+8.7%"
  },
  {
    id: 3,
    name: "Lookalike - Top 1%",
    type: "Lookalike",
    size: "3.2M",
    source: "Customer Lookalike",
    status: "active",
    campaigns: 2,
    performance: "+22.1%"
  },
  {
    id: 4,
    name: "App Users - Android",
    type: "Mobile App",
    size: "1.8M",
    source: "Mobile App Events",
    status: "paused",
    campaigns: 1,
    performance: "+5.3%"
  },
  {
    id: 5,
    name: "Demographic Segment A",
    type: "Demographics",
    size: "5.7M",
    source: "Platform Data",
    status: "active",
    campaigns: 4,
    performance: "+11.9%"
  }
]

const Audiences = () => {
  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-success" : "bg-warning"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Custom": return "bg-primary"
      case "Retargeting": return "bg-warning"
      case "Lookalike": return "bg-success"
      case "Mobile App": return "bg-purple-500"
      case "Demographics": return "bg-blue-500"
      default: return "bg-secondary"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audiences</h1>
          <p className="text-muted-foreground">Create and manage your targeting audiences</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Audience
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Audiences</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Audiences</p>
                <p className="text-2xl font-bold">9</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Users className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">14.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Copy className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lookalikes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search audiences..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter by Type
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter by Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audiences Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Audiences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Audience Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaigns</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audienceData.map((audience) => (
                  <tr key={audience.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">{audience.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary"
                        className={getTypeColor(audience.type)}
                      >
                        {audience.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-medium">{audience.size}</td>
                    <td className="py-4 px-4 text-muted-foreground">{audience.source}</td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary"
                        className={getStatusColor(audience.status)}
                      >
                        {audience.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">{audience.campaigns} active</td>
                    <td className="py-4 px-4">
                      <span className="text-success font-medium">{audience.performance}</span>
                    </td>
                    <td className="py-4 px-4">
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
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Copy className="h-4 w-4" />
                            Create Lookalike
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
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

export default Audiences
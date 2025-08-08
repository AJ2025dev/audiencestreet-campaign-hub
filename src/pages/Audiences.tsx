import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  TrendingUp,
  Target,
  Upload,
  Download,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Heart,
  ShoppingBag,
  Activity
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const audienceData = [
  {
    id: 1,
    name: "High-Value Customers",
    type: "Custom",
    size: "2.5M",
    source: "Customer Data",
    status: "active",
    campaigns: 3,
    performance: "+15.2%",
    reach: "2.1M",
    ctr: "2.8%",
    conversionRate: "4.2%",
    avgOrderValue: "$145",
    lastUpdated: "2 hours ago",
    description: "Customers with lifetime value > $500"
  },
  {
    id: 2,
    name: "Website Visitors (30 days)",
    type: "Retargeting",
    size: "450K",
    source: "Website Pixel",
    status: "active",
    campaigns: 5,
    performance: "+8.7%",
    reach: "380K",
    ctr: "3.1%",
    conversionRate: "2.8%",
    avgOrderValue: "$89",
    lastUpdated: "1 hour ago",
    description: "Website visitors in the last 30 days"
  },
  {
    id: 3,
    name: "Lookalike - Top 1%",
    type: "Lookalike",
    size: "3.2M",
    source: "Customer Lookalike",
    status: "active",
    campaigns: 2,
    performance: "+22.1%",
    reach: "2.8M",
    ctr: "2.4%",
    conversionRate: "5.1%",
    avgOrderValue: "$167",
    lastUpdated: "3 hours ago",
    description: "Lookalike based on top 1% customers"
  },
  {
    id: 4,
    name: "App Users - Android",
    type: "Mobile App",
    size: "1.8M",
    source: "Mobile App Events",
    status: "paused",
    campaigns: 1,
    performance: "+5.3%",
    reach: "1.6M",
    ctr: "1.9%",
    conversionRate: "3.4%",
    avgOrderValue: "$67",
    lastUpdated: "1 day ago",
    description: "Active Android app users"
  },
  {
    id: 5,
    name: "Demographic Segment A",
    type: "Demographics",
    size: "5.7M",
    source: "Platform Data",
    status: "active",
    campaigns: 4,
    performance: "+11.9%",
    reach: "4.9M",
    ctr: "2.1%",
    conversionRate: "3.8%",
    avgOrderValue: "$95",
    lastUpdated: "4 hours ago",
    description: "Female, 25-45, Income $50K+"
  }
]

const performanceData = [
  { date: 'Mon', reach: 125000, impressions: 450000, clicks: 8900, conversions: 234 },
  { date: 'Tue', reach: 142000, impressions: 510000, clicks: 10200, conversions: 278 },
  { date: 'Wed', reach: 138000, impressions: 490000, clicks: 9800, conversions: 265 },
  { date: 'Thu', reach: 155000, impressions: 580000, clicks: 11600, conversions: 312 },
  { date: 'Fri', reach: 168000, impressions: 620000, clicks: 12400, conversions: 345 },
  { date: 'Sat', reach: 145000, impressions: 520000, clicks: 10400, conversions: 289 },
  { date: 'Sun', reach: 132000, impressions: 470000, clicks: 9400, conversions: 256 }
]

const deviceBreakdown = [
  { name: 'Mobile', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Desktop', value: 35, color: 'hsl(var(--success))' },
  { name: 'Tablet', value: 20, color: 'hsl(var(--warning))' }
]

const audienceInsights = [
  { category: 'Age 18-24', percentage: 28, growth: '+12%' },
  { category: 'Age 25-34', percentage: 35, growth: '+8%' },
  { category: 'Age 35-44', percentage: 24, growth: '+15%' },
  { category: 'Age 45+', percentage: 13, growth: '+5%' }
]

const Audiences = () => {
  const [selectedAudience, setSelectedAudience] = useState<typeof audienceData[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

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

  const filteredAudiences = audienceData.filter(audience => {
    return (filterType === "all" || audience.type.toLowerCase() === filterType) &&
           (filterStatus === "all" || audience.status === filterStatus)
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audience Management</h1>
          <p className="text-muted-foreground">Create, manage and analyze your targeting audiences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Audience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Audience</DialogTitle>
              </DialogHeader>
              <CreateAudienceForm onClose={() => setShowCreateDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Audiences</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-success">+2 this week</p>
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
                <p className="text-xs text-muted-foreground">75% active rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Eye className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">14.2M</p>
                <p className="text-xs text-success">+18% vs last month</p>
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
                <p className="text-xs text-muted-foreground">Avg 3.2M reach</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MousePointer className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold">2.4%</p>
                <p className="text-xs text-success">+0.3% vs industry</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg AOV</p>
                <p className="text-2xl font-bold">$112</p>
                <p className="text-xs text-success">+$15 vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audience Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Reach"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {deviceBreakdown.map((device) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium">{device.value}%</span>
                </div>
              ))}
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="retargeting">Retargeting</SelectItem>
                <SelectItem value="lookalike">Lookalike</SelectItem>
                <SelectItem value="mobile app">Mobile App</SelectItem>
                <SelectItem value="demographics">Demographics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Audiences Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Audiences ({filteredAudiences.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Audience</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Size/Reach</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaigns</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudiences.map((audience) => (
                  <tr key={audience.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-foreground">{audience.name}</div>
                        <div className="text-sm text-muted-foreground">{audience.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary"
                        className={getTypeColor(audience.type)}
                      >
                        {audience.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{audience.size}</div>
                      <div className="text-sm text-muted-foreground">Reach: {audience.reach}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-success font-medium">{audience.performance}</span>
                        <div className="text-xs text-muted-foreground">
                          CTR: {audience.ctr} | CVR: {audience.conversionRate}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary"
                        className={getStatusColor(audience.status)}
                      >
                        {audience.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">{audience.campaigns} active</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{audience.lastUpdated}</td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => setSelectedAudience(audience)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Target className="h-4 w-4" />
                            Create Lookalike
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
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

      {/* Audience Details Modal */}
      {selectedAudience && (
        <AudienceDetailsModal 
          audience={selectedAudience} 
          onClose={() => setSelectedAudience(null)} 
        />
      )}
    </div>
  )
}

const CreateAudienceForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="criteria">Criteria</TabsTrigger>
        <TabsTrigger value="lookalike">Lookalike</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="audienceName">Audience Name</Label>
          <Input id="audienceName" placeholder="Enter audience name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe your audience" rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Audience Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select audience type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Audience</SelectItem>
              <SelectItem value="retargeting">Retargeting</SelectItem>
              <SelectItem value="lookalike">Lookalike</SelectItem>
              <SelectItem value="demographics">Demographics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="criteria" className="space-y-4 mt-6">
        <div className="space-y-4">
          <h4 className="font-medium">Demographics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age Range</Label>
              <div className="flex items-center gap-2">
                <Input placeholder="18" type="number" />
                <span>to</span>
                <Input placeholder="65" type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="grid grid-cols-3 gap-2">
              {["Technology", "Sports", "Fashion", "Travel", "Food", "Fitness"].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox id={interest} />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="lookalike" className="space-y-4 mt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Source Audience</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select source audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-value">High-Value Customers</SelectItem>
                <SelectItem value="converters">Recent Converters</SelectItem>
                <SelectItem value="engaged">Engaged Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Similarity Percentage</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select similarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Top 1% (Highest Quality)</SelectItem>
                <SelectItem value="5">Top 5% (High Quality)</SelectItem>
                <SelectItem value="10">Top 10% (Good Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border/50 shadow-lg z-50">
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
                <SelectItem value="de">🇩🇪 Germany</SelectItem>
                <SelectItem value="fr">🇫🇷 France</SelectItem>
                <SelectItem value="it">🇮🇹 Italy</SelectItem>
                <SelectItem value="es">🇪🇸 Spain</SelectItem>
                <SelectItem value="nl">🇳🇱 Netherlands</SelectItem>
                <SelectItem value="se">🇸🇪 Sweden</SelectItem>
                <SelectItem value="no">🇳🇴 Norway</SelectItem>
                <SelectItem value="dk">🇩🇰 Denmark</SelectItem>
                <SelectItem value="fi">🇫🇮 Finland</SelectItem>
                <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                <SelectItem value="sg">🇸🇬 Singapore</SelectItem>
                <SelectItem value="hk">🇭🇰 Hong Kong</SelectItem>
                <SelectItem value="nz">🇳🇿 New Zealand</SelectItem>
                <SelectItem value="ch">🇨🇭 Switzerland</SelectItem>
                <SelectItem value="at">🇦🇹 Austria</SelectItem>
                <SelectItem value="be">🇧🇪 Belgium</SelectItem>
                <SelectItem value="ie">🇮🇪 Ireland</SelectItem>
                <SelectItem value="pt">🇵🇹 Portugal</SelectItem>
                <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
                <SelectItem value="br">🇧🇷 Brazil</SelectItem>
                <SelectItem value="ar">🇦🇷 Argentina</SelectItem>
                <SelectItem value="cl">🇨🇱 Chile</SelectItem>
                <SelectItem value="co">🇨🇴 Colombia</SelectItem>
                <SelectItem value="pe">🇵🇪 Peru</SelectItem>
                <SelectItem value="in">🇮🇳 India</SelectItem>
                <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                <SelectItem value="th">🇹🇭 Thailand</SelectItem>
                <SelectItem value="my">🇲🇾 Malaysia</SelectItem>
                <SelectItem value="ph">🇵🇭 Philippines</SelectItem>
                <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                <SelectItem value="za">🇿🇦 South Africa</SelectItem>
                <SelectItem value="ng">🇳🇬 Nigeria</SelectItem>
                <SelectItem value="eg">🇪🇬 Egypt</SelectItem>
                <SelectItem value="ae">🇦🇪 United Arab Emirates</SelectItem>
                <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
                <SelectItem value="il">🇮🇱 Israel</SelectItem>
                <SelectItem value="tr">🇹🇷 Turkey</SelectItem>
                <SelectItem value="pl">🇵🇱 Poland</SelectItem>
                <SelectItem value="cz">🇨🇿 Czech Republic</SelectItem>
                <SelectItem value="hu">🇭🇺 Hungary</SelectItem>
                <SelectItem value="ro">🇷🇴 Romania</SelectItem>
                <SelectItem value="bg">🇧🇬 Bulgaria</SelectItem>
                <SelectItem value="hr">🇭🇷 Croatia</SelectItem>
                <SelectItem value="rs">🇷🇸 Serbia</SelectItem>
                <SelectItem value="si">🇸🇮 Slovenia</SelectItem>
                <SelectItem value="sk">🇸🇰 Slovakia</SelectItem>
                <SelectItem value="lt">🇱🇹 Lithuania</SelectItem>
                <SelectItem value="lv">🇱🇻 Latvia</SelectItem>
                <SelectItem value="ee">🇪🇪 Estonia</SelectItem>
                <SelectItem value="ru">🇷🇺 Russia</SelectItem>
                <SelectItem value="ua">🇺🇦 Ukraine</SelectItem>
                <SelectItem value="by">🇧🇾 Belarus</SelectItem>
                <SelectItem value="kz">🇰🇿 Kazakhstan</SelectItem>
                <SelectItem value="cn">🇨🇳 China</SelectItem>
                <SelectItem value="tw">🇹🇼 Taiwan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="upload" className="space-y-4 mt-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Upload your customer list</p>
            <p className="text-sm text-muted-foreground">CSV, Excel files up to 50MB</p>
            <Button variant="outline" className="mt-4">
              Choose File
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Data Columns</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Email", "Phone", "Customer ID", "Name"].map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox id={column} />
                  <Label htmlFor={column} className="text-sm">{column}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="gradient">Create Audience</Button>
      </div>
    </Tabs>
  )
}

const AudienceDetailsModal = ({ 
  audience, 
  onClose 
}: { 
  audience: typeof audienceData[0]
  onClose: () => void 
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{audience.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{audience.size}</p>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{audience.reach}</p>
                  <p className="text-sm text-muted-foreground">Reach</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{audience.ctr}</p>
                  <p className="text-sm text-muted-foreground">CTR</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{audience.avgOrderValue}</p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Age Distribution</h4>
                  <div className="space-y-3">
                    {audienceInsights.map((insight) => (
                      <div key={insight.category} className="flex items-center justify-between">
                        <span className="text-sm">{insight.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${insight.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{insight.percentage}%</span>
                          <span className="text-xs text-success">{insight.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-medium">{audience.conversionRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Campaigns</span>
                      <span className="font-medium">{audience.campaigns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Updated</span>
                      <span className="font-medium">{audience.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Data Source</span>
                      <span className="font-medium">{audience.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Create Lookalike
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="gradient" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Audience
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Audiences
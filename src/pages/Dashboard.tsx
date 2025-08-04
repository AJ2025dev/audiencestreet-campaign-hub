import { MetricCard } from "@/components/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Users, 
  TrendingUp,
  PlusCircle,
  Play,
  Pause,
  MoreHorizontal
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

const performanceData = [
  { date: '1/1', impressions: 12500, clicks: 125, spend: 245 },
  { date: '1/2', impressions: 15200, clicks: 198, spend: 298 },
  { date: '1/3', impressions: 18300, clicks: 234, spend: 356 },
  { date: '1/4', impressions: 14500, clicks: 167, spend: 287 },
  { date: '1/5', impressions: 16800, clicks: 203, spend: 334 },
  { date: '1/6', impressions: 19200, clicks: 256, spend: 398 },
  { date: '1/7', impressions: 21500, clicks: 289, spend: 445 },
]

const campaignData = [
  {
    id: 1,
    name: "P&G Gillete",
    status: "active",
    impressions: "1.2M",
    clicks: "24.5K",
    ctr: "2.04%",
    spend: "$8,450",
    cpm: "$7.04"
  },
  {
    id: 2,
    name: "Apex Girl",
    status: "paused",
    impressions: "890K",
    clicks: "18.2K",
    ctr: "2.04%",
    spend: "$6,230",
    cpm: "$6.99"
  },
  {
    id: 3,
    name: "Jio Retail",
    status: "active",
    impressions: "2.1M",
    clicks: "45.6K",
    ctr: "2.17%",
    spend: "$12,890",
    cpm: "$6.14"
  }
]

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-elegant">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Monitor your campaign performance and key metrics</p>
          </div>
          <Button variant="gradient" className="gap-2 shadow-lg hover:shadow-glow transition-all duration-300">
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <DollarSign className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-xl font-bold text-foreground">$24,680</p>
                  <p className="text-xs text-success font-medium">+12.5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors duration-300">
                  <Eye className="h-5 w-5 text-warning group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Impressions</p>
                  <p className="text-xl font-bold text-foreground">4.2M</p>
                  <p className="text-xs text-success font-medium">+8.2% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors duration-300">
                  <MousePointer className="h-5 w-5 text-success group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-xl font-bold text-foreground">88.3K</p>
                  <p className="text-xs text-success font-medium">+15.3% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                  <TrendingUp className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-xl font-bold text-foreground">2.08%</p>
                  <p className="text-xs text-success font-medium">+0.12% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground" 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="impressions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    name="Impressions"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3} 
                    name="Clicks"
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spend Chart */}
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-warning/5 to-warning/10">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                Daily Spend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground" 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="spend" 
                    fill="url(#spendGradient)"
                    radius={[6, 6, 0, 0]}
                    name="Spend ($)"
                  />
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Campaign Table */}
        <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/30 bg-gradient-to-r from-success/5 to-success/10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-5 w-5 text-success" />
              </div>
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Impressions</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Clicks</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">CTR</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Spend</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">CPM</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignData.map((campaign, index) => (
                    <tr key={campaign.id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                      <td className="py-4 px-6 font-semibold text-foreground">{campaign.name}</td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant="secondary"
                          className={campaign.status === "active" 
                            ? "bg-success/10 text-success border-success/20 hover:bg-success/20" 
                            : "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-medium">{campaign.impressions}</td>
                      <td className="py-4 px-6 font-medium">{campaign.clicks}</td>
                      <td className="py-4 px-6 font-medium text-primary">{campaign.ctr}</td>
                      <td className="py-4 px-6 font-bold text-foreground">{campaign.spend}</td>
                      <td className="py-4 px-6 font-medium">{campaign.cpm}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                          >
                            {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-muted/50 transition-all duration-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
    </div>
  )
}

export default Dashboard
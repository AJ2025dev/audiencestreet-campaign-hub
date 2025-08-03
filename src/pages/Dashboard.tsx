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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your campaign performance and key metrics</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Spend"
          value="$24,680"
          change="+12.5% from last month"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Impressions"
          value="4.2M"
          change="+8.2% from last month"
          changeType="positive"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Clicks"
          value="88.3K"
          change="+15.3% from last month"
          changeType="positive"
          icon={<MousePointer className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="CTR"
          value="2.08%"
          change="+0.12% from last month"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Trends
            </CardTitle>
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
                  dataKey="impressions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  name="Impressions"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2} 
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Daily Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip />
                <Bar 
                  dataKey="spend" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Spend ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spend</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">CPM</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={campaign.status === "active" ? "default" : "secondary"}
                        className={campaign.status === "active" ? "bg-success" : ""}
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{campaign.impressions}</td>
                    <td className="py-3 px-4">{campaign.clicks}</td>
                    <td className="py-3 px-4">{campaign.ctr}</td>
                    <td className="py-3 px-4 font-medium">{campaign.spend}</td>
                    <td className="py-3 px-4">{campaign.cpm}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon">
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
  )
}

export default Dashboard
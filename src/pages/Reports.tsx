import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  DollarSign,
  Eye,
  MousePointer,
  Users
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
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { MetricCard } from "@/components/MetricCard"

const performanceData = [
  { date: 'Jan 1', impressions: 125000, clicks: 1250, spend: 2450, conversions: 45 },
  { date: 'Jan 2', impressions: 152000, clicks: 1980, spend: 2980, conversions: 67 },
  { date: 'Jan 3', impressions: 183000, clicks: 2340, spend: 3560, conversions: 89 },
  { date: 'Jan 4', impressions: 145000, clicks: 1670, spend: 2870, conversions: 52 },
  { date: 'Jan 5', impressions: 168000, clicks: 2030, spend: 3340, conversions: 78 },
  { date: 'Jan 6', impressions: 192000, clicks: 2560, spend: 3980, conversions: 95 },
  { date: 'Jan 7', impressions: 215000, clicks: 2890, spend: 4450, conversions: 112 },
]

const deviceData = [
  { name: 'Mobile', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Desktop', value: 35, color: 'hsl(var(--success))' },
  { name: 'Tablet', value: 20, color: 'hsl(var(--warning))' },
]

const audienceData = [
  { age: '18-24', impressions: 125000, clicks: 2500, conversions: 45 },
  { age: '25-34', impressions: 185000, clicks: 3700, conversions: 78 },
  { age: '35-44', impressions: 145000, clicks: 2900, conversions: 65 },
  { age: '45-54', impressions: 95000, clicks: 1900, conversions: 42 },
  { age: '55+', impressions: 65000, clicks: 1300, conversions: 28 },
]

const campaignPerformance = [
  {
    campaign: "Q1 Brand Awareness",
    impressions: "1.2M",
    clicks: "24.5K",
    spend: "$8,450",
    conversions: "456",
    ctr: "2.04%",
    cpm: "$7.04",
    cpc: "$0.34",
    roas: "3.2x"
  },
  {
    campaign: "Holiday Retargeting",
    impressions: "890K",
    clicks: "18.2K",
    spend: "$6,230",
    conversions: "389",
    ctr: "2.04%",
    cpm: "$6.99",
    cpc: "$0.34",
    roas: "4.1x"
  },
  {
    campaign: "Mobile App Install",
    impressions: "2.1M",
    clicks: "45.6K",
    spend: "$12,890",
    conversions: "1,234",
    ctr: "2.17%",
    cpm: "$6.14",
    cpc: "$0.28",
    roas: "2.8x"
  }
]

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive performance insights and data analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="gradient" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Spend"
          value="$27,570"
          change="+18.2% vs last period"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Impressions"
          value="4.19M"
          change="+12.5% vs last period"
          changeType="positive"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Clicks"
          value="88.3K"
          change="+15.3% vs last period"
          changeType="positive"
          icon={<MousePointer className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Conversions"
          value="2,079"
          change="+22.1% vs last period"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="ROAS"
          value="3.4x"
          change="+0.3x vs last period"
          changeType="positive"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="impressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#impressions)"
                  name="Impressions"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#clicks)"
                  name="Clicks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device & Audience Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Device Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-sm">{device.name}: {device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Audience by Age</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={audienceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="age" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip />
                <Bar 
                  dataKey="impressions" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Impressions"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spend</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">CPC</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {campaignPerformance.map((campaign, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{campaign.campaign}</td>
                    <td className="py-3 px-4">{campaign.impressions}</td>
                    <td className="py-3 px-4">{campaign.clicks}</td>
                    <td className="py-3 px-4 font-medium">{campaign.spend}</td>
                    <td className="py-3 px-4">{campaign.conversions}</td>
                    <td className="py-3 px-4">{campaign.ctr}</td>
                    <td className="py-3 px-4">{campaign.cpc}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-success">
                        {campaign.roas}
                      </Badge>
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

export default Reports
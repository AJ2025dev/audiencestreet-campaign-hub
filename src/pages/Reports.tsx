import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  DollarSign,
  Eye,
  MousePointer,
  Users,
  Target,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Star,
  Zap,
  Activity
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
  Area,
  ComposedChart,
  Scatter,
  ScatterChart
} from 'recharts'
import { MetricCard } from "@/components/MetricCard"

const performanceData = [
  { date: 'Jan 1', impressions: 125000, clicks: 1250, spend: 2450, conversions: 45, revenue: 6750 },
  { date: 'Jan 2', impressions: 152000, clicks: 1980, spend: 2980, conversions: 67, revenue: 10050 },
  { date: 'Jan 3', impressions: 183000, clicks: 2340, spend: 3560, conversions: 89, revenue: 13350 },
  { date: 'Jan 4', impressions: 145000, clicks: 1670, spend: 2870, conversions: 52, revenue: 7800 },
  { date: 'Jan 5', impressions: 168000, clicks: 2030, spend: 3340, conversions: 78, revenue: 11700 },
  { date: 'Jan 6', impressions: 192000, clicks: 2560, spend: 3980, conversions: 95, revenue: 14250 },
  { date: 'Jan 7', impressions: 215000, clicks: 2890, spend: 4450, conversions: 112, revenue: 16800 },
]

const deviceData = [
  { name: 'Mobile', value: 45, color: 'hsl(var(--primary))', impressions: 1890000, clicks: 42300, conversions: 1245 },
  { name: 'Desktop', value: 35, color: 'hsl(var(--success))', impressions: 1470000, clicks: 35700, conversions: 1089 },
  { name: 'Tablet', value: 20, color: 'hsl(var(--warning))', impressions: 840000, clicks: 18900, conversions: 567 },
]

const audienceData = [
  { age: '18-24', impressions: 125000, clicks: 2500, conversions: 45, spend: 890, revenue: 6750 },
  { age: '25-34', impressions: 185000, clicks: 3700, conversions: 78, spend: 1340, revenue: 11700 },
  { age: '35-44', impressions: 145000, clicks: 2900, conversions: 65, spend: 1120, revenue: 9750 },
  { age: '45-54', impressions: 95000, clicks: 1900, conversions: 42, spend: 750, revenue: 6300 },
  { age: '55+', impressions: 65000, clicks: 1300, conversions: 28, spend: 520, revenue: 4200 },
]

const geoData = [
  { location: 'California', impressions: 345000, clicks: 7890, conversions: 234, spend: 2340, revenue: 35100 },
  { location: 'New York', impressions: 298000, clicks: 6450, conversions: 198, spend: 1980, revenue: 29700 },
  { location: 'Texas', impressions: 267000, clicks: 5890, conversions: 167, spend: 1780, revenue: 25050 },
  { location: 'Florida', impressions: 234000, clicks: 4980, conversions: 145, spend: 1560, revenue: 21750 },
  { location: 'Illinois', impressions: 189000, clicks: 4120, conversions: 119, spend: 1290, revenue: 17850 },
]

const campaignPerformance = [
  {
    campaign: "P&G Gillete",
    impressions: "1.2M",
    clicks: "24.5K",
    spend: "$8,450",
    conversions: "456",
    revenue: "$68,400",
    ctr: "2.04%",
    cpm: "$7.04",
    cpc: "$0.34",
    cpa: "$18.53",
    roas: "8.1x",
    status: "Active"
  },
  {
    campaign: "Apex Girl",
    impressions: "890K",
    clicks: "18.2K",
    spend: "$6,230",
    conversions: "389",
    revenue: "$58,350",
    ctr: "2.04%",
    cpm: "$6.99",
    cpc: "$0.34",
    cpa: "$16.02",
    roas: "9.4x",
    status: "Active"
  },
  {
    campaign: "Jio Retail",
    impressions: "2.1M",
    clicks: "45.6K",
    spend: "$12,890",
    conversions: "1,234",
    revenue: "$86,380",
    ctr: "2.17%",
    cpm: "$6.14",
    cpc: "$0.28",
    cpa: "$10.45",
    roas: "6.7x",
    status: "Active"
  }
]

const creativePerformance = [
  {
    creative: "Banner_Video_001",
    type: "Video",
    impressions: "456K",
    clicks: "12.3K",
    ctr: "2.7%",
    conversions: "234",
    cvr: "1.9%",
    spend: "$3,450",
    roas: "4.2x"
  },
  {
    creative: "Static_Display_002",
    type: "Image",
    impressions: "389K",
    clicks: "8.9K",
    ctr: "2.3%",
    conversions: "178",
    cvr: "2.0%",
    spend: "$2,890",
    roas: "3.8x"
  },
  {
    creative: "Carousel_Mobile_003",
    type: "Carousel",
    impressions: "567K",
    clicks: "15.6K",
    ctr: "2.8%",
    conversions: "298",
    cvr: "1.9%",
    spend: "$4,230",
    roas: "5.1x"
  }
]

const attributionData = [
  { touchpoint: 'First Click', conversions: 145, percentage: 28.5, value: '$21,750' },
  { touchpoint: 'Last Click', conversions: 234, percentage: 46.0, value: '$35,100' },
  { touchpoint: 'Linear', conversions: 198, percentage: 39.0, value: '$29,700' },
  { touchpoint: 'Time Decay', conversions: 167, percentage: 32.8, value: '$25,050' },
  { touchpoint: 'Position Based', conversions: 189, percentage: 37.2, value: '$28,350' },
]

const cohortData = [
  { cohort: 'Jan 2024', week1: 100, week2: 78, week3: 65, week4: 54, week8: 42, week12: 35 },
  { cohort: 'Feb 2024', week1: 100, week2: 82, week3: 69, week4: 58, week8: 45, week12: 38 },
  { cohort: 'Mar 2024', week1: 100, week2: 85, week3: 72, week4: 61, week8: 48, week12: 41 },
  { cohort: 'Apr 2024', week1: 100, week2: 88, week3: 75, week4: 64, week8: 51, week12: 44 },
]

const Reports = () => {
  const [dateRange, setDateRange] = useState("30days")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive performance insights and data analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="gradient" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="cohort">Cohort</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <MetricCard
              title="Total Spend"
              value="$27,570"
              change="+18.2% vs last period"
              changeType="positive"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Revenue"
              value="$184,200"
              change="+22.1% vs last period"
              changeType="positive"
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
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
              icon={<Target className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="ROAS"
              value="6.7x"
              change="+0.8x vs last period"
              changeType="positive"
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Trends</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="clicks">Clicks</SelectItem>
                    <SelectItem value="impressions">Impressions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={performanceData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-muted-foreground" />
                  <YAxis yAxisId="left" className="text-muted-foreground" />
                  <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#revenue)"
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    stroke="hsl(var(--success))"
                    strokeWidth={3}
                    name="Conversions"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="spend"
                    fill="hsl(var(--warning))"
                    opacity={0.7}
                    name="Spend ($)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device & Geography Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: device.color }}
                        />
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.impressions.toLocaleString()} impressions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{device.value}%</p>
                        <p className="text-sm text-success">CVR: {((device.conversions / device.clicks) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {geoData.map((location, index) => (
                    <div key={location.location} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{location.location}</p>
                          <p className="text-sm text-muted-foreground">{location.impressions.toLocaleString()} impressions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{location.revenue.toLocaleString()}</p>
                        <p className="text-sm text-success">ROAS: {(location.revenue / location.spend).toFixed(1)}x</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressions</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spend</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignPerformance.map((campaign, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{campaign.campaign}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-success">
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{campaign.impressions}</td>
                        <td className="py-3 px-4">{campaign.clicks}</td>
                        <td className="py-3 px-4">{campaign.ctr}</td>
                        <td className="py-3 px-4">{campaign.conversions}</td>
                        <td className="py-3 px-4 font-medium">{campaign.spend}</td>
                        <td className="py-3 px-4 font-medium text-success">{campaign.revenue}</td>
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
        </TabsContent>

        {/* Attribution Analysis Tab */}
        <TabsContent value="attribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attribution Models Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attributionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="touchpoint" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip />
                    <Bar 
                      dataKey="conversions" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      name="Conversions"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Journey Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div>
                      <p className="font-medium">Avg Touches to Conversion</p>
                      <p className="text-sm text-muted-foreground">Customer touchpoints</p>
                    </div>
                    <p className="text-2xl font-bold">3.4</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                    <div>
                      <p className="font-medium">Avg Time to Conversion</p>
                      <p className="text-sm text-muted-foreground">From first touch</p>
                    </div>
                    <p className="text-2xl font-bold">7.2d</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                    <div>
                      <p className="font-medium">Top Converting Path</p>
                      <p className="text-sm text-muted-foreground">Most common journey</p>
                    </div>
                    <p className="text-sm font-medium">Display → Search → Direct</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attribution Model Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Attribution Model</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Percentage</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributionData.map((model, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{model.touchpoint}</td>
                        <td className="py-3 px-4">{model.conversions}</td>
                        <td className="py-3 px-4">{model.percentage}%</td>
                        <td className="py-3 px-4 font-medium">{model.value}</td>
                        <td className="py-3 px-4">${(21750 / model.conversions).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creative Performance Tab */}
        <TabsContent value="creative" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Top Creative CTR</p>
                    <p className="text-2xl font-bold">2.8%</p>
                    <p className="text-xs text-success">Carousel_Mobile_003</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Zap className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best ROAS</p>
                    <p className="text-2xl font-bold">5.1x</p>
                    <p className="text-xs text-success">Carousel_Mobile_003</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <Activity className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Creatives</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">8 active, 4 paused</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Creative Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Creative</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Impressions</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CTR</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">CVR</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spend</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creativePerformance.map((creative, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{creative.creative}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{creative.type}</Badge>
                        </td>
                        <td className="py-3 px-4">{creative.impressions}</td>
                        <td className="py-3 px-4">{creative.clicks}</td>
                        <td className="py-3 px-4 font-medium">{creative.ctr}</td>
                        <td className="py-3 px-4">{creative.conversions}</td>
                        <td className="py-3 px-4">{creative.cvr}</td>
                        <td className="py-3 px-4">{creative.spend}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-success">
                            {creative.roas}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Analysis Tab */}
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Performance by Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={audienceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="age" className="text-muted-foreground" />
                  <YAxis yAxisId="left" className="text-muted-foreground" />
                  <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
                  <Tooltip />
                  <Bar 
                    yAxisId="left"
                    dataKey="impressions" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Impressions"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    stroke="hsl(var(--success))"
                    strokeWidth={3}
                    name="Conversions"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Age Group</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceData.map((audience) => (
                    <div key={audience.age} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{audience.age}</p>
                        <p className="text-sm text-muted-foreground">{audience.conversions} conversions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${audience.revenue.toLocaleString()}</p>
                        <p className="text-sm text-success">
                          ROAS: {(audience.revenue / audience.spend).toFixed(1)}x
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Age</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={audienceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="age" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${((value as number) * 100).toFixed(2)}%`, 
                        'Conversion Rate'
                      ]}
                      labelFormatter={(label) => `Age Group: ${label}`}
                    />
                    <Bar 
                      dataKey={(data) => data.conversions / data.clicks}
                      fill="hsl(var(--warning))" 
                      radius={[4, 4, 0, 0]}
                      name="Conversion Rate"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cohort Analysis Tab */}
        <TabsContent value="cohort" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cohort</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 1</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 2</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 3</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 4</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 8</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-3 px-4 font-medium">{cohort.cohort}</td>
                        <td className="py-3 px-4 text-center">{cohort.week1}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cohort.week2 > 80 ? "text-success" : cohort.week2 > 60 ? "text-warning" : "text-destructive"}>
                            {cohort.week2}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cohort.week3 > 70 ? "text-success" : cohort.week3 > 50 ? "text-warning" : "text-destructive"}>
                            {cohort.week3}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cohort.week4 > 60 ? "text-success" : cohort.week4 > 40 ? "text-warning" : "text-destructive"}>
                            {cohort.week4}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cohort.week8 > 45 ? "text-success" : cohort.week8 > 30 ? "text-warning" : "text-destructive"}>
                            {cohort.week8}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cohort.week12 > 40 ? "text-success" : cohort.week12 > 25 ? "text-warning" : "text-destructive"}>
                            {cohort.week12}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg 30-Day Retention</p>
                    <p className="text-2xl font-bold">59%</p>
                    <p className="text-xs text-success">+5% vs industry</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Clock className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Performing Cohort</p>
                    <p className="text-2xl font-bold">Apr 2024</p>
                    <p className="text-xs text-success">44% at week 12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retention Trend</p>
                    <p className="text-2xl font-bold">+8%</p>
                    <p className="text-xs text-success">Improving monthly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build Custom Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Metrics</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metrics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impressions">Impressions</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dimensions</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dimensions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="audience">Audience</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="device">Device</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="gradient">Generate Report</Button>
                <Button variant="outline">Save Template</Button>
                <Button variant="outline">Schedule Report</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Weekly Performance Summary", metrics: "All KPIs", lastRun: "2 hours ago" },
                  { name: "Creative Performance Deep Dive", metrics: "Creative metrics", lastRun: "1 day ago" },
                  { name: "Audience ROI Analysis", metrics: "Revenue & ROAS", lastRun: "3 days ago" }
                ].map((template, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.metrics}</p>
                        <p className="text-xs text-muted-foreground">Last run: {template.lastRun}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">Run</Button>
                          <Button size="sm" variant="ghost">Edit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports
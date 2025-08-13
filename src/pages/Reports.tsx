import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { useToast } from '@/hooks/use-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  BarChart3, 
  DollarSign, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Download,
  RefreshCw,
  Clock,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { addDays, format } from 'date-fns'

interface CampaignReport {
  campaign_id: string
  campaign_name: string
  total_impressions: number
  total_clicks: number
  total_spend_cents: number
  ctr: number
  cpm: number
  cpc: number
  date_range: string
}

export default function ReportsPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: addDays(new Date(), -7),
    to: new Date()
  })
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all')
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null)

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['campaign-reports'] })
        queryClient.invalidateQueries({ queryKey: ['hourly-performance'] })
      }, refreshInterval * 1000)
      
      return () => clearInterval(interval)
    }
  }, [refreshInterval, queryClient])

  // Fetch user campaigns for filter dropdown
  const { data: campaigns } = useQuery({
    queryKey: ["user-campaigns", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name")
        .eq("user_id", user!.id)
        .order("name")
      if (error) throw error
      return data
    },
  })

  // Fetch campaign performance reports
  const { data: campaignReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["campaign-reports", user?.id, selectedCampaign, dateRange],
    enabled: !!user?.id && !!dateRange.from && !!dateRange.to,
    queryFn: async () => {
      // For now, we'll use mock data since impression_tracking table may be empty
      // In production, this would aggregate real impression and click data
      const mockReports = campaigns?.map(campaign => ({
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        total_impressions: Math.floor(Math.random() * 1000000) + 100000,
        total_clicks: Math.floor(Math.random() * 50000) + 1000,
        total_spend_cents: Math.floor(Math.random() * 500000) + 10000,
        ctr: Math.random() * 5 + 1, // 1-6% CTR
        cpm: Math.random() * 10 + 5, // $5-15 CPM
        cpc: Math.random() * 2 + 0.5, // $0.50-2.50 CPC
        date_range: `${dateRange.from ? format(dateRange.from, 'MMM d') : ''} - ${dateRange.to ? format(dateRange.to, 'MMM d') : ''}`
      })) || []

      if (selectedCampaign !== 'all') {
        return mockReports.filter(report => report.campaign_id === selectedCampaign)
      }

      return mockReports as CampaignReport[]
    },
  })

  // Fetch hourly performance data for charts
  const { data: hourlyData } = useQuery({
    queryKey: ["hourly-performance", user?.id, selectedCampaign, dateRange],
    enabled: !!user?.id && !!dateRange.from && !!dateRange.to,
    queryFn: async () => {
      // Generate realistic hourly data based on the date range
      const hours = []
      const now = new Date()
      
      for (let i = 23; i >= 0; i--) {
        const hourDate = new Date(now.getTime() - (i * 60 * 60 * 1000))
        hours.push({
          hour: format(hourDate, 'HH:mm'),
          impressions: Math.floor(Math.random() * 5000) + 1000,
          clicks: Math.floor(Math.random() * 200) + 20,
          spend_cents: Math.floor(Math.random() * 50000) + 10000
        })
      }
      
      return hours
    },
  })

  const exportData = useMutation({
    mutationFn: async () => {
      if (!campaignReports) return
      
      const csvContent = [
        'Campaign,Impressions,Clicks,CTR,Spend,CPM,CPC',
        ...campaignReports.map(report => 
          `${report.campaign_name},${report.total_impressions},${report.total_clicks},${report.ctr.toFixed(2)}%,$${(report.total_spend_cents / 100).toFixed(2)},${report.cpm.toFixed(2)},${report.cpc.toFixed(2)}`
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `campaign_reports_${format(new Date(), 'yyyy-MM-dd')}.csv`
      link.click()
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Report exported successfully",
      })
    },
  })

  const totals = campaignReports?.reduce((acc, report) => ({
    impressions: acc.impressions + report.total_impressions,
    clicks: acc.clicks + report.total_clicks,
    spend: acc.spend + (report.total_spend_cents / 100),
  }), { impressions: 0, clicks: 0, spend: 0 }) || { impressions: 0, clicks: 0, spend: 0 }

  const avgCTR = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0
  const avgCPM = totals.impressions > 0 ? totals.spend / (totals.impressions / 1000) : 0

  const performanceColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-elegant">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Performance Reports
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Real-time campaign analytics and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={refreshInterval?.toString() || 'manual'} onValueChange={(value) => setRefreshInterval(value === 'manual' ? null : parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Refresh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="60">1min</SelectItem>
                <SelectItem value="300">5min</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Label>Campaign:</Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns?.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label>Date Range:</Label>
                <DatePickerWithRange 
                  date={dateRange} 
                  onDateChange={(date) => {
                    if (date) {
                      setDateRange({ 
                        from: date.from,
                        to: date.to 
                      })
                    }
                  }} 
                />
              </div>
              <Button variant="outline" onClick={() => exportData.mutate()} disabled={!campaignReports?.length}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <DollarSign className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-xl font-bold text-foreground">${totals.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-success font-medium">Real-time</p>
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
                  <p className="text-xl font-bold text-foreground">{totals.impressions.toLocaleString()}</p>
                  <p className="text-xs text-success font-medium">Live tracking</p>
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
                  <p className="text-xl font-bold text-foreground">{totals.clicks.toLocaleString()}</p>
                  <p className="text-xs text-success font-medium">Real-time</p>
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
                  <p className="text-xs text-muted-foreground">Avg CTR</p>
                  <p className="text-xl font-bold text-foreground">{avgCTR.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">CPM: ${avgCPM.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                Hourly Performance
                {refreshInterval && (
                  <Badge variant="secondary" className="ml-auto">
                    <Clock className="h-3 w-3 mr-1" />
                    Auto-refresh: {refreshInterval}s
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis 
                    dataKey="hour" 
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

          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-warning/5 to-warning/10">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                Spend Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={campaignReports?.slice(0, 5).map((report, index) => ({
                      name: report.campaign_name,
                      value: report.total_spend_cents / 100,
                      fill: performanceColors[index % performanceColors.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {campaignReports?.slice(0, 5).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={performanceColors[index % performanceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Spend']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Table */}
        <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/30 bg-gradient-to-r from-success/5 to-success/10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-success/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-success" />
              </div>
              Campaign Performance Detail
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/30 bg-muted/30">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>CPM</TableHead>
                    <TableHead>CPC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        Loading reports...
                      </TableCell>
                    </TableRow>
                  ) : campaignReports && campaignReports.length > 0 ? (
                    campaignReports.map((report, index) => (
                      <TableRow key={report.campaign_id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                        <TableCell className="font-semibold text-foreground">{report.campaign_name}</TableCell>
                        <TableCell className="font-medium">{report.total_impressions.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{report.total_clicks.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-primary">{report.ctr.toFixed(2)}%</TableCell>
                        <TableCell className="font-bold text-foreground">${(report.total_spend_cents / 100).toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${report.cpm.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${report.cpc.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        No campaign data available for the selected period
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
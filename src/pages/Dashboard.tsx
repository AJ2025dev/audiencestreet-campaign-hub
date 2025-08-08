import { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

// The dashboard will pull campaigns from Supabase and compute summary metrics.
interface Campaign {
  id: string
  name: string
  status: string
  budget: number | null
  daily_budget: number | null
  start_date: string | null
  end_date: string | null
}


const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch campaigns for the current user
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) {
        setCampaigns([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, name, status, budget, daily_budget, start_date, end_date')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
        if (error) {
          console.error('Error fetching campaigns for dashboard:', error)
          setCampaigns([])
        } else {
          setCampaigns((data as Campaign[]) || [])
        }
      } catch (err) {
        console.error(err)
        setCampaigns([])
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [user])

  // Compute summary metrics
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0)
  const totalCampaigns = campaigns.length
  // Placeholder metrics for impressions/clicks/spend since not available yet
  const totalImpressions = totalCampaigns * 1000000 // pretend each campaign 1M impressions
  const totalClicks = totalCampaigns * 20000 // pretend each campaign 20k clicks
  const totalSpend = totalBudget // treat budget as spend for now

  // Build data for charts (dummy based on campaigns count)
  const performanceData = campaigns.map((c, idx) => ({
    date: `Day ${idx + 1}`,
    impressions: 10000 + idx * 5000,
    clicks: 200 + idx * 50,
    spend: (c.budget || 0) / 30
  }))
  // Fallback when no campaigns
  if (performanceData.length === 0) {
    performanceData.push({ date: 'N/A', impressions: 0, clicks: 0, spend: 0 })
  }

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
          <Button variant="gradient" className="gap-2 shadow-lg hover:shadow-glow transition-all duration-300" onClick={() => navigate('/campaigns') }>
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Spend */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <DollarSign className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-xl font-bold text-foreground">
                    {totalSpend ? `$${(totalSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                  </p>
                  <p className="text-xs text-success font-medium">{campaigns.length ? `${campaigns.length} Campaign${campaigns.length > 1 ? 's' : ''}` : 'No campaigns'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Impressions */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors duration-300">
                  <Eye className="h-5 w-5 text-warning group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Impressions</p>
                  <p className="text-xl font-bold text-foreground">
                    {totalImpressions.toLocaleString()}
                  </p>
                  <p className="text-xs text-success font-medium">{totalCampaigns ? `${totalCampaigns} Campaign${totalCampaigns > 1 ? 's' : ''}` : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Clicks */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors duration-300">
                  <MousePointer className="h-5 w-5 text-success group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-xl font-bold text-foreground">
                    {totalClicks.toLocaleString()}
                  </p>
                  <p className="text-xs text-success font-medium">{totalCampaigns ? `${totalCampaigns} Campaign${totalCampaigns > 1 ? 's' : ''}` : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* CTR */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                  <TrendingUp className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-xl font-bold text-foreground">
                    {totalImpressions ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : '0.00%'}
                  </p>
                  <p className="text-xs text-success font-medium">{totalCampaigns ? `${totalCampaigns} Campaign${totalCampaigns > 1 ? 's' : ''}` : ''}</p>
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
              Recent Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Budget</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Daily Budget</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Start Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">End Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr key={campaign.id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                      <td className="py-4 px-6 font-semibold text-foreground">{campaign.name}</td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="secondary"
                          className={campaign.status === 'active'
                            ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                            : campaign.status === 'paused'
                              ? 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
                              : 'bg-muted/20 text-muted-foreground border-muted/30'}
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {campaign.budget ? `$${Number(campaign.budget).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {campaign.daily_budget ? `$${Number(campaign.daily_budget).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                          >
                            {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
                  {campaigns.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">
                        No campaigns found. Create your first campaign to see it here!
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">
                        Loading campaigns...
                      </td>
                    </tr>
                  )}
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
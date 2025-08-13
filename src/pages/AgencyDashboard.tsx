import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { useQuery } from '@tanstack/react-query'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Building2,
  Eye,
  MousePointer
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Advertiser {
  id: string
  email: string
  profiles: {
    company_name: string
    contact_email: string
  }
}

interface Campaign {
  id: string
  name: string
  status: string
  budget: number
  user_id: string
  advertiser: {
    profiles: { company_name: string }
  }
}

export default function AgencyDashboard() {
  const { user, profile } = useAuth()
  const { toast } = useToast()

  // Fetch advertisers managed by this agency
  const { data: advertisers } = useQuery({
    queryKey: ["agency-advertisers", user?.id],
    enabled: !!user?.id && profile?.role === 'agency',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agency_advertisers')
        .select(`
          advertiser_id
        `)
        .eq('agency_id', user!.id)
        .eq('is_active', true)

      if (error) throw error
      
      if (!data?.length) return []
      
      const advertiserIds = data.map(item => item.advertiser_id)
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, company_name, contact_email')
        .in('user_id', advertiserIds)
      
      if (profileError) throw profileError
      
      return profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.contact_email || '',
        profiles: {
          company_name: profile.company_name,
          contact_email: profile.contact_email || ''
        }
      })) as Advertiser[]
    },
  })

  // Fetch campaigns for managed advertisers
  const { data: campaigns } = useQuery({
    queryKey: ["agency-campaigns", user?.id, advertisers],
    enabled: !!user?.id && profile?.role === 'agency' && !!advertisers?.length,
    queryFn: async () => {
      if (!advertisers?.length) return []
      
      const advertiserIds = advertisers.map(adv => adv.id)
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          id,
          name,
          status,
          budget,
          user_id
        `)
        .in('user_id', advertiserIds)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data?.map(campaign => ({
        ...campaign,
        advertiser: {
          profiles: { company_name: advertisers.find(adv => adv.id === campaign.user_id)?.profiles.company_name || '' }
        }
      })) as Campaign[]
    },
  })

  // Mock performance data - in real implementation this would come from actual metrics
  const performanceData = [
    { date: '1/1', spend: 2450, impressions: 125000, clicks: 2500 },
    { date: '1/2', spend: 2980, impressions: 152000, clicks: 3040 },
    { date: '1/3', spend: 3560, impressions: 183000, clicks: 3664 },
    { date: '1/4', spend: 2870, impressions: 145000, clicks: 2900 },
    { date: '1/5', spend: 3340, impressions: 168000, clicks: 3360 },
    { date: '1/6', spend: 3980, impressions: 192000, clicks: 3840 },
    { date: '1/7', spend: 4450, impressions: 215000, clicks: 4300 },
  ]

  const totalSpend = performanceData.reduce((sum, day) => sum + day.spend, 0)
  const totalImpressions = performanceData.reduce((sum, day) => sum + day.impressions, 0)
  const totalClicks = performanceData.reduce((sum, day) => sum + day.clicks, 0)
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-elegant">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Agency Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage your advertiser accounts and campaigns</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {profile?.company_name}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Advertisers</p>
                  <p className="text-xl font-bold text-foreground">{advertisers?.length || 0}</p>
                  <p className="text-xs text-success font-medium">Updated live</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors duration-300">
                  <Activity className="h-5 w-5 text-warning group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Campaigns</p>
                  <p className="text-xl font-bold text-foreground">{activeCampaigns}</p>
                  <p className="text-xs text-success font-medium">Across all advertisers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors duration-300">
                  <DollarSign className="h-5 w-5 text-success group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-xl font-bold text-foreground">${totalSpend.toLocaleString()}</p>
                  <p className="text-xs text-success font-medium">This week</p>
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
                  <p className="text-xs text-success font-medium">Portfolio average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                Portfolio Performance
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
                    dataKey="spend" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    name="Spend ($)"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Advertiser List */}
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-success/5 to-success/10">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-success" />
                </div>
                Managed Advertisers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/30">
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Company</th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advertisers && advertisers.length > 0 ? (
                      advertisers.map((advertiser, index) => (
                        <tr key={advertiser.id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                          <td className="py-4 px-6 font-semibold text-foreground">{advertiser.profiles.company_name}</td>
                          <td className="py-4 px-6 text-muted-foreground">{advertiser.profiles.contact_email}</td>
                          <td className="py-4 px-6">
                            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                              Active
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-muted-foreground">
                          No advertisers assigned yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/30 bg-gradient-to-r from-warning/5 to-warning/10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Activity className="h-5 w-5 text-warning" />
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
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Advertiser</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns && campaigns.length > 0 ? (
                    campaigns.slice(0, 10).map((campaign, index) => (
                      <tr key={campaign.id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                        <td className="py-4 px-6 font-semibold text-foreground">{campaign.name}</td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {advertisers?.find(adv => adv.id === campaign.user_id)?.profiles.company_name}
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant="secondary"
                            className={campaign.status === "active" 
                              ? "bg-success/10 text-success border-success/20 hover:bg-success/20" 
                              : campaign.status === "paused"
                              ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"
                              : "bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/20"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 font-bold text-foreground">${campaign.budget.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No campaigns found
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
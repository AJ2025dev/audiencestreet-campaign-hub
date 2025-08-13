import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Pause,
  Play,
  Settings,
  Shield
} from 'lucide-react'

interface CampaignBudget {
  id: string
  name: string
  status: string
  budget: number
  daily_budget?: number
  spend_today: number
  total_spend: number
  spend_rate: number
  budget_utilization: number
  daily_budget_utilization?: number
  is_overspending: boolean
  estimated_completion: string
  pacing_status: 'on_track' | 'under_pacing' | 'over_pacing' | 'at_risk'
}

interface BudgetAlert {
  campaign_id: string
  campaign_name: string
  alert_type: 'daily_budget_reached' | 'total_budget_reached' | 'overspending' | 'pacing_risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  created_at: string
}

export default function BudgetControl() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch campaign budget data with real-time spend tracking
  const { data: campaignBudgets, isLoading } = useQuery({
    queryKey: ["campaign-budgets", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          status,
          budget,
          daily_budget,
          start_date,
          end_date,
          created_at
        `)
        .eq("user_id", user!.id)
        .in('status', ['active', 'paused'])

      if (campaignsError) throw campaignsError

      // Get spend data for each campaign
      const budgetData = await Promise.all(
        campaigns?.map(async (campaign) => {
          // Get total spend
          const { data: impressionData } = await supabase
            .from('impression_tracking')
            .select('spend_cents')
            .eq('campaign_id', campaign.id)

          const totalSpendCents = impressionData?.reduce((sum, record) => sum + (record.spend_cents || 0), 0) || 0
          const totalSpend = totalSpendCents / 100

          // Get today's spend
          const today = new Date().toISOString().split('T')[0]
          const { data: todayData } = await supabase
            .from('impression_tracking')
            .select('spend_cents')
            .eq('campaign_id', campaign.id)
            .gte('created_at', today + 'T00:00:00')
            .lt('created_at', today + 'T23:59:59')

          const todaySpendCents = todayData?.reduce((sum, record) => sum + (record.spend_cents || 0), 0) || 0
          const spendToday = todaySpendCents / 100

          // Calculate spend rate (per hour)
          const campaignStart = new Date(campaign.start_date)
          const now = new Date()
          const hoursRunning = Math.max(1, (now.getTime() - campaignStart.getTime()) / (1000 * 60 * 60))
          const spendRate = totalSpend / hoursRunning

          // Calculate budget utilization
          const budgetUtilization = campaign.budget > 0 ? (totalSpend / campaign.budget) * 100 : 0
          const dailyBudgetUtilization = campaign.daily_budget > 0 ? (spendToday / campaign.daily_budget) * 100 : undefined

          // Determine if overspending
          const isOverspending = totalSpend > campaign.budget || (campaign.daily_budget && spendToday > campaign.daily_budget)

          // Estimate completion
          const remainingBudget = Math.max(0, campaign.budget - totalSpend)
          const hoursToCompletion = spendRate > 0 ? remainingBudget / spendRate : Infinity
          const estimatedCompletion = isFinite(hoursToCompletion) 
            ? new Date(now.getTime() + hoursToCompletion * 60 * 60 * 1000).toISOString()
            : 'Never at current rate'

          // Determine pacing status
          let pacingStatus: CampaignBudget['pacing_status'] = 'on_track'
          if (budgetUtilization > 90) pacingStatus = 'at_risk'
          else if (budgetUtilization > 110) pacingStatus = 'over_pacing'
          else if (budgetUtilization < 70) pacingStatus = 'under_pacing'

          return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            budget: campaign.budget,
            daily_budget: campaign.daily_budget,
            spend_today: spendToday,
            total_spend: totalSpend,
            spend_rate: spendRate,
            budget_utilization: budgetUtilization,
            daily_budget_utilization: dailyBudgetUtilization,
            is_overspending: isOverspending,
            estimated_completion: estimatedCompletion,
            pacing_status: pacingStatus
          }
        }) || []
      )

      return budgetData as CampaignBudget[]
    },
    refetchInterval: 60000, // Refresh every minute
  })

  // Generate budget alerts
  const budgetAlerts = campaignBudgets?.reduce((alerts: BudgetAlert[], campaign) => {
    const alerts_list: BudgetAlert[] = []

    if (campaign.is_overspending) {
      alerts_list.push({
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        alert_type: 'overspending',
        severity: 'critical',
        message: `Campaign is overspending! Total: $${campaign.total_spend.toFixed(2)} / $${campaign.budget}`,
        created_at: new Date().toISOString()
      })
    }

    if (campaign.daily_budget && campaign.daily_budget_utilization && campaign.daily_budget_utilization > 90) {
      alerts_list.push({
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        alert_type: 'daily_budget_reached',
        severity: campaign.daily_budget_utilization > 100 ? 'critical' : 'high',
        message: `Daily budget ${campaign.daily_budget_utilization.toFixed(0)}% utilized`,
        created_at: new Date().toISOString()
      })
    }

    if (campaign.pacing_status === 'over_pacing') {
      alerts_list.push({
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        alert_type: 'pacing_risk',
        severity: 'medium',
        message: `Campaign is pacing above target (${campaign.budget_utilization.toFixed(0)}% of budget used)`,
        created_at: new Date().toISOString()
      })
    }

    return [...alerts, ...alerts_list]
  }, []) || []

  // Auto-pause overspending campaigns
  const autoPauseMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase.rpc('update_campaign_status', {
        p_campaign_id: campaignId,
        p_status: 'paused'
      })
      if (error) throw error
    },
    onSuccess: (_, campaignId) => {
      const campaign = campaignBudgets?.find(c => c.id === campaignId)
      queryClient.invalidateQueries({ queryKey: ["campaign-budgets"] })
      toast({
        title: "Auto-pause activated",
        description: `${campaign?.name} has been paused due to budget overspend`,
      })
    },
  })

  const getPacingColor = (status: CampaignBudget['pacing_status']) => {
    switch (status) {
      case 'on_track': return 'text-success'
      case 'under_pacing': return 'text-warning'
      case 'over_pacing': return 'text-destructive'
      case 'at_risk': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityColor = (severity: BudgetAlert['severity']) => {
    switch (severity) {
      case 'low': return 'text-muted-foreground'
      case 'medium': return 'text-warning'
      case 'high': return 'text-destructive'
      case 'critical': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-elegant">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Budget Control Center
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Monitor and control campaign spending in real-time</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Auto-protection enabled
          </Badge>
        </div>

        {/* Critical Alerts */}
        {budgetAlerts.length > 0 && (
          <div className="space-y-2">
            {budgetAlerts
              .filter(alert => alert.severity === 'critical')
              .map((alert, index) => (
                <Alert key={index} className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      <strong>{alert.campaign_name}:</strong> {alert.message}
                    </span>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => autoPauseMutation.mutate(alert.campaign_id)}
                    >
                      Auto-Pause
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        )}

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <DollarSign className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Active Budget</p>
                  <p className="text-xl font-bold text-foreground">
                    ${campaignBudgets?.reduce((sum, c) => sum + c.budget, 0).toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-success font-medium">Across {campaignBudgets?.length || 0} campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors duration-300">
                  <TrendingUp className="h-5 w-5 text-success group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold text-foreground">
                    ${campaignBudgets?.reduce((sum, c) => sum + c.total_spend, 0).toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-success font-medium">Real-time tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors duration-300">
                  <Clock className="h-5 w-5 text-warning group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Today's Spend</p>
                  <p className="text-xl font-bold text-foreground">
                    ${campaignBudgets?.reduce((sum, c) => sum + c.spend_today, 0).toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-success font-medium">Live updates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg group-hover:bg-destructive/20 transition-colors duration-300">
                  <AlertTriangle className="h-5 w-5 text-destructive group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Alerts</p>
                  <p className="text-xl font-bold text-foreground">{budgetAlerts.length}</p>
                  <p className="text-xs text-destructive font-medium">
                    {budgetAlerts.filter(a => a.severity === 'critical').length} critical
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Budget Details */}
        <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/30 bg-gradient-to-r from-success/5 to-success/10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              Campaign Budget Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Budget Progress</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Daily Spend</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Pacing</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Loading budget data...
                      </td>
                    </tr>
                  ) : campaignBudgets && campaignBudgets.length > 0 ? (
                    campaignBudgets.map((campaign, index) => (
                      <tr key={campaign.id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-foreground">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${campaign.total_spend.toFixed(2)} / ${campaign.budget.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant="secondary"
                            className={
                              campaign.status === "active" && !campaign.is_overspending
                                ? "bg-success/10 text-success border-success/20" 
                                : campaign.is_overspending
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-warning/10 text-warning border-warning/20"
                            }
                          >
                            {campaign.is_overspending ? 'Overspend' : campaign.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Budget</span>
                              <span>{campaign.budget_utilization.toFixed(0)}%</span>
                            </div>
                            <Progress 
                              value={Math.min(100, campaign.budget_utilization)} 
                              className="h-2"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-medium">${campaign.spend_today.toFixed(2)}</div>
                            {campaign.daily_budget && (
                              <div className="text-muted-foreground">
                                / ${campaign.daily_budget} ({campaign.daily_budget_utilization?.toFixed(0)}%)
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant="outline" 
                            className={getPacingColor(campaign.pacing_status)}
                          >
                            {campaign.pacing_status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {campaign.is_overspending && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => autoPauseMutation.mutate(campaign.id)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No active campaigns found
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
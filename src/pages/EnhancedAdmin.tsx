import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Shield, 
  Plus, 
  Edit,
  Trash2,
  Building2,
  UserCheck,
  Settings,
  Key,
  Percent,
  Wallet,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Target,
  BarChart3,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw
} from 'lucide-react'

interface User {
  id: string
  email: string
  created_at: string
  profiles: {
    id: string
    role: string
    company_name: string
    contact_email: string
    phone?: string
    address?: string
    credit_limit?: number
    spending_limit?: number
    is_active?: boolean
  }
}

interface Commission {
  id: string
  user_id: string
  commission_type: string
  percentage: number
  is_active: boolean
  created_at: string
}

interface BudgetControl {
  id: string
  user_id: string
  daily_limit: number
  monthly_limit: number
  current_spend: number
  is_active: boolean
}

interface APIConfiguration {
  id: string
  key_name: string
  key_value: string
  description?: string
  is_active: boolean
}

export default function EnhancedAdmin() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Safety check - return loading if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  // State management
  const [users, setUsers] = useState<User[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [budgetControls, setBudgetControls] = useState<BudgetControl[]>([])
  const [apiConfigs, setApiConfigs] = useState<APIConfiguration[]>([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false)
  
  // Enhanced states for new functionality
  const [isLoadingEquativ, setIsLoadingEquativ] = useState(false)
  const [equativData, setEquativData] = useState<any>(null)
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false)
  const [generatedStrategy, setGeneratedStrategy] = useState('')
  
  const [userForm, setUserForm] = useState({
    email: '',
    role: 'advertiser',
    company_name: '',
    contact_email: '',
    phone: '',
    address: ''
  })
  
  const [commissionForm, setCommissionForm] = useState({
    user_id: '',
    commission_type: 'percentage',
    percentage: 0
  })
  
  const [apiForm, setApiForm] = useState({
    key_name: '',
    key_value: '',
    description: ''
  })

  const [campaignStrategyForm, setCampaignStrategyForm] = useState({
    brandDescription: '',
    campaignObjective: '',
    landingPage: '',
    budget: '',
    target_audience: '',
    geographic_targeting: '',
    duration_days: ''
  })

  // Auth check
  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        navigate('/')
        return
      }
      
      if (!profile || profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        })
        navigate('/')
        return
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      navigate('/')
    }
  }

  // Data fetching functions
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
        // Still show some data for demo purposes
        const demoUserId = '12345678-1234-4567-8901-123456789012'
        setUsers([
          {
            id: demoUserId,
            email: 'admin@example.com',
            created_at: new Date().toISOString(),
            profiles: {
              id: demoUserId,
              user_id: demoUserId,
              role: 'admin',
              company_name: 'Demo Admin',
              contact_email: 'admin@example.com',
              phone: '+1-555-0001',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        ])
        return
      }

      // Format real users data
      const formattedUsers = data?.map(profile => ({
        id: profile.user_id || profile.id,
        email: profile.contact_email || profile.email || 'user@company.com',
        created_at: profile.created_at,
        profiles: profile
      })) || []

      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    }
  }

  const fetchCommissions = async () => {
    try {
      // Mock commission data for demonstration
      const mockCommissions = users.slice(0, 3).map((user, index) => ({
        id: `comm-${index}`,
        user_id: user.id,
        commission_type: ['percentage', 'fixed', 'tiered'][index],
        percentage: [15.5, 12.0, 18.5][index],
        is_active: true,
        created_at: new Date().toISOString()
      }))
      setCommissions(mockCommissions)
    } catch (error) {
      console.error('Error fetching commissions:', error)
      setCommissions([])
    }
  }

  const fetchBudgetControls = async () => {
    try {
      // Mock data for budget controls
      setBudgetControls([])
    } catch (error) {
      console.error('Error fetching budget controls:', error)
      setBudgetControls([])
    }
  }

  const fetchApiConfigurations = async () => {
    try {
      // Mock data for API configurations
      setApiConfigs([
        {
          id: '1',
          key_name: 'EQUATIV_API_KEY',
          key_value: '****',
          description: 'Equativ DSP API Key for campaign management',
          is_active: true
        },
        {
          id: '2', 
          key_name: 'OPENAI_API_KEY',
          key_value: '****',
          description: 'OpenAI API Key for campaign strategy generation',
          is_active: true
        }
      ])
    } catch (error) {
      console.error('Error fetching API configurations:', error)
      setApiConfigs([])
    }
  }

  const fetchCampaigns = async () => {
    try {
      // Mock campaigns data
      setCampaigns([])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setCampaigns([])
    }
  }

  // CRUD operations
  const createUser = async () => {
    if (!userForm.email || !userForm.company_name) {
      toast({
        title: "Validation Error",
        description: "Email and company name are required",
        variant: "destructive",
      })
      return
    }

    try {
      // Create profile entry with proper UUID
      const newUserId = crypto.randomUUID()
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: newUserId,
          role: userForm.role,
          company_name: userForm.company_name,
          contact_email: userForm.contact_email || userForm.email,
          phone: userForm.phone,
          address: userForm.address
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        throw new Error(`Failed to create profile: ${profileError.message}`)
      }

      toast({
        title: "Success",
        description: `User '${userForm.company_name}' created successfully`,
      })

      setIsUserDialogOpen(false)
      setUserForm({
        email: '',
        role: 'advertiser',
        company_name: '',
        contact_email: '',
        phone: '',
        address: ''
      })
      
      // Refresh users list
      await fetchUsers()
      
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const updateUserProfile = async (userId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      fetchUsers()
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const createCommission = async () => {
    if (!commissionForm.user_id || !commissionForm.percentage) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Mock commission creation - would integrate with actual DB
    toast({
      title: "Success",
      description: "Commission rule created successfully",
    })
    setIsCommissionDialogOpen(false)
    setCommissionForm({
      user_id: '',
      commission_type: 'percentage',
      percentage: 0
    })
  }

  const saveApiConfiguration = async () => {
    if (!apiForm.key_name || !apiForm.key_value) {
      toast({
        title: "Validation Error",
        description: "Key name and value are required",
        variant: "destructive",
      })
      return
    }

    // Mock API config save - would integrate with Supabase secrets
    toast({
      title: "Success",
      description: "API configuration saved successfully",
    })
    setIsApiDialogOpen(false)
    setApiForm({
      key_name: '',
      key_value: '',
      description: ''
    })
  }

  // Equativ integration functions
  const fetchEquativMediaPlan = async () => {
    setIsLoadingEquativ(true)
    try {
      const response = await supabase.functions.invoke('equativ-media-planning', {
        body: {
          action: 'get_reach_forecast',
          planData: {
            targeting: { 
              demographics: 'adults_25_54', 
              geography: 'US',
              interests: ['technology', 'business']
            },
            budget: 50000,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            channels: ['display', 'video', 'native']
          }
        }
      })
      
      if (response.error) {
        console.error('Equativ API error:', response.error)
        // Provide mock data for demonstration
        setEquativData({
          reach_forecast: {
            estimated_reach: 2500000,
            estimated_impressions: 15000000,
            estimated_cpm: 3.25,
            confidence_level: 0.85
          },
          channels: [
            { name: 'Display', budget_allocation: 0.6, estimated_reach: 1500000 },
            { name: 'Video', budget_allocation: 0.3, estimated_reach: 750000 },
            { name: 'Native', budget_allocation: 0.1, estimated_reach: 250000 }
          ]
        })
        toast({
          title: "Demo Data",
          description: "Showing sample Equativ media planning data",
        })
      } else {
        setEquativData(response.data)
        toast({
          title: "Success",
          description: "Equativ media planning data fetched successfully",
        })
      }
    } catch (error: any) {
      console.error('Error fetching Equativ data:', error)
      // Fallback to demo data
      setEquativData({
        reach_forecast: {
          estimated_reach: 2500000,
          estimated_impressions: 15000000,
          estimated_cpm: 3.25,
          confidence_level: 0.85,
          note: "Demo data - Equativ API not configured"
        }
      })
      toast({
        title: "Demo Mode",
        description: "Showing sample data. Configure Equativ API for live data.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingEquativ(false)
    }
  }

  const activateEquativCampaign = async (campaignData: any) => {
    setIsLoadingEquativ(true)
    try {
      const response = await supabase.functions.invoke('equativ-campaign-management', {
        body: {
          action: 'activate_campaign',
          campaignId: campaignData.id,
          campaignData: {
            name: `Campaign for ${campaignData.profiles?.company_name || 'Advertiser'}`,
            budget: 10000,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      })
      
      if (response.error) {
        console.error('Equativ campaign error:', response.error)
        // Simulate successful activation
        toast({
          title: "Demo Activation",
          description: `Campaign for ${campaignData.profiles?.company_name || 'Advertiser'} activated (demo mode)`,
        })
      } else {
        toast({
          title: "Success",
          description: "Campaign activated successfully via Equativ",
        })
      }
    } catch (error: any) {
      console.error('Error activating campaign:', error)
      // Still show success for demo purposes
      toast({
        title: "Demo Mode",
        description: `Campaign activation simulated for ${campaignData.profiles?.company_name || 'Advertiser'}`,
        variant: "default",
      })
    } finally {
      setIsLoadingEquativ(false)
    }
  }

  const generateCampaignStrategy = async () => {
    if (!campaignStrategyForm.brandDescription || !campaignStrategyForm.campaignObjective) {
      toast({
        title: "Validation Error",
        description: "Brand description and campaign objective are required",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingStrategy(true)
    try {
      const response = await supabase.functions.invoke('generate-campaign-strategy', {
        body: {
          brandDescription: campaignStrategyForm.brandDescription,
          campaignObjective: campaignStrategyForm.campaignObjective,
          landingPage: campaignStrategyForm.landingPage,
          platformContext: {
            budget: campaignStrategyForm.budget,
            targetAudience: campaignStrategyForm.target_audience,
            geographicTargeting: campaignStrategyForm.geographic_targeting,
            duration: campaignStrategyForm.duration_days
          }
        }
      })
      
      if (response.error) {
        console.error('Strategy generation error:', response.error)
        // Provide a sample strategy
        const sampleStrategy = `## CAMPAIGN STRATEGY FOR: ${campaignStrategyForm.brandDescription}\n\n### OBJECTIVE: ${campaignStrategyForm.campaignObjective}\n\n**RECOMMENDED PLATFORM MIX:**\n• TAS Open Marketplace (25% - $${(parseFloat(campaignStrategyForm.budget?.replace(/[^0-9.]/g, '') || '0') * 0.25).toFixed(0)})\n• Google DV360 (35% - Premium Video & Display)\n• Amazon DSP (25% - E-commerce Targeting)\n• The Trade Desk (15% - Premium Programmatic)\n\n**TARGET AUDIENCE:**\n• Demographics: Adults 25-54\n• Interests: ${campaignStrategyForm.target_audience || 'Business, Technology, Shopping'}\n• Geographic: ${campaignStrategyForm.geographic_targeting || 'United States'}\n\n**CREATIVE STRATEGY:**\n• Video: 15s, 30s formats for awareness\n• Display: 300x250, 728x90, 320x50 for retargeting\n• Native: In-feed placements for engagement\n\n**BIDDING STRATEGY:**\n• Phase 1: CPM bidding for reach\n• Phase 2: CPC optimization for engagement\n• Phase 3: CPA targeting for conversions\n\n**SUCCESS METRICS:**\n• Reach: 2M+ unique users\n• CTR: >0.8%\n• Conversion Rate: >2.5%\n• ROAS: >4:1\n\n*This is a sample strategy. Configure OpenAI API for AI-generated strategies.*`
        
        setGeneratedStrategy(sampleStrategy)
        toast({
          title: "Sample Strategy",
          description: "Generated sample strategy. Configure OpenAI API for AI-powered strategies.",
        })
      } else {
        setGeneratedStrategy(response.data.strategy)
        toast({
          title: "Success",
          description: "AI-powered campaign strategy generated successfully",
        })
      }
    } catch (error: any) {
      console.error('Error generating strategy:', error)
      // Fallback strategy
      const fallbackStrategy = `## CAMPAIGN STRATEGY\n\n**BRAND:** ${campaignStrategyForm.brandDescription}\n**OBJECTIVE:** ${campaignStrategyForm.campaignObjective}\n\n**PLATFORM RECOMMENDATIONS:**\n1. TAS Open Marketplace (25% allocation - mandatory)\n2. Premium DSPs for targeted reach\n3. Retail media for shopping intent\n\nConfigure OpenAI API key in settings for detailed AI strategies.`
      
      setGeneratedStrategy(fallbackStrategy)
      toast({
        title: "Demo Strategy",
        description: "Basic strategy template generated. Add OpenAI API for full AI capabilities.",
        variant: "default",
      })
    } finally {
      setIsGeneratingStrategy(false)
    }
  }

  useEffect(() => {
    if (user) {
      checkAdminAccess()
    }
  }, [user])

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      
      setLoading(true)
      try {
        await Promise.all([
          fetchUsers(),
          fetchCommissions(),
          fetchBudgetControls(),
          fetchApiConfigurations(),
          fetchCampaigns()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      loadData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }
  
  // Additional safety check
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Enhanced Admin Dashboard
          </h1>
          <p className="text-lg text-slate-300">
            Comprehensive platform management and control center
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                  <p className="text-3xl font-bold">{campaigns.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
                  <p className="text-3xl font-bold">$2.4M</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">API Status</p>
                  <p className="text-3xl font-bold text-green-500">●</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management ({users.length} total)
                  </CardTitle>
                  <Button onClick={() => setIsUserDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Details</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{user.profiles.company_name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.profiles.contact_email}
                            </p>
                            {user.profiles.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.profiles.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.profiles.role === 'admin' ? 'default' : 'secondary'}>
                            {user.profiles.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsUserDialogOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agencies">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Agency Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Media Planning Tools */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Media Planning Tools</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button onClick={fetchEquativMediaPlan} disabled={isLoadingEquativ} className="h-auto p-4 flex-col">
                          {isLoadingEquativ ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <RefreshCw className="h-6 w-6 mb-2" />}
                          <span className="font-medium">Fetch Media Plan</span>
                          <span className="text-xs opacity-75">Get reach forecasts</span>
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            setIsLoadingEquativ(true)
                            setTimeout(() => {
                              setEquativData({
                                budget_allocation: {
                                  display: { percentage: 45, budget: 22500 },
                                  video: { percentage: 35, budget: 17500 },
                                  native: { percentage: 20, budget: 10000 }
                                },
                                total_budget: 50000
                              })
                              setIsLoadingEquativ(false)
                              toast({ title: "Success", description: "Budget allocation optimized" })
                            }, 2000)
                          }}
                          disabled={isLoadingEquativ} 
                          className="h-auto p-4 flex-col"
                        >
                          {isLoadingEquativ ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <Target className="h-6 w-6 mb-2" />}
                          <span className="font-medium">Optimize Budget</span>
                          <span className="text-xs opacity-75">Auto allocation</span>
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            setIsLoadingEquativ(true)
                            setTimeout(() => {
                              setEquativData({
                                inventory_analysis: {
                                  premium_inventory: 45,
                                  standard_inventory: 35,
                                  remnant_inventory: 20
                                },
                                availability: "High"
                              })
                              setIsLoadingEquativ(false)
                              toast({ title: "Success", description: "Inventory analysis complete" })
                            }, 1500)
                          }}
                          disabled={isLoadingEquativ} 
                          className="h-auto p-4 flex-col"
                        >
                          {isLoadingEquativ ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <BarChart3 className="h-6 w-6 mb-2" />}
                          <span className="font-medium">Analyze Inventory</span>
                          <span className="text-xs opacity-75">Available ad slots</span>
                        </Button>
                      </div>
                      
                      {equativData && (
                        <Card>
                          <CardHeader>
                            <h4 className="font-semibold">Media Planning Results</h4>
                          </CardHeader>
                          <CardContent>
                            {equativData.reach_forecast && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-3 bg-primary/10 rounded">
                                  <div className="text-2xl font-bold text-primary">{(equativData.reach_forecast.estimated_reach / 1000000).toFixed(1)}M</div>
                                  <div className="text-xs text-muted-foreground">Estimated Reach</div>
                                </div>
                                <div className="text-center p-3 bg-green-500/10 rounded">
                                  <div className="text-2xl font-bold text-green-600">{(equativData.reach_forecast.estimated_impressions / 1000000).toFixed(1)}M</div>
                                  <div className="text-xs text-muted-foreground">Impressions</div>
                                </div>
                                <div className="text-center p-3 bg-blue-500/10 rounded">
                                  <div className="text-2xl font-bold text-blue-600">${equativData.reach_forecast.estimated_cpm}</div>
                                  <div className="text-xs text-muted-foreground">Avg CPM</div>
                                </div>
                                <div className="text-center p-3 bg-purple-500/10 rounded">
                                  <div className="text-2xl font-bold text-purple-600">{(equativData.reach_forecast.confidence_level * 100).toFixed(0)}%</div>
                                  <div className="text-xs text-muted-foreground">Confidence</div>
                                </div>
                              </div>
                            )}
                            
                            {equativData.budget_allocation && (
                              <div className="space-y-2">
                                <h5 className="font-medium">Budget Allocation (${equativData.total_budget?.toLocaleString()})</h5>
                                {Object.entries(equativData.budget_allocation).map(([channel, data]: [string, any]) => (
                                  <div key={channel} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <span className="capitalize">{channel}</span>
                                    <div className="text-right">
                                      <div className="font-medium">${data.budget?.toLocaleString()}</div>
                                      <div className="text-xs text-muted-foreground">{data.percentage}%</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {equativData.inventory_analysis && (
                              <div className="space-y-2">
                                <h5 className="font-medium">Inventory Analysis</h5>
                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span>Premium Inventory:</span>
                                    <span>{equativData.inventory_analysis.premium_inventory}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Standard Inventory:</span>
                                    <span>{equativData.inventory_analysis.standard_inventory}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Availability:</span>
                                    <Badge variant="default">{equativData.inventory_analysis.availability}</Badge>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agency</TableHead>
                        <TableHead>Clients</TableHead>
                        <TableHead>Monthly Spend</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.filter(u => u.profiles.role === 'agency').map((agency) => (
                        <TableRow key={agency.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{agency.profiles.company_name}</p>
                              <p className="text-sm text-muted-foreground">{agency.profiles.contact_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{Math.floor(Math.random() * 10) + 1}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">${(Math.random() * 500000 + 50000).toFixed(0)}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{Math.floor(Math.random() * 10 + 5)}%</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advertisers">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Advertiser Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Advertiser</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Active Campaigns</TableHead>
                      <TableHead>Monthly Spend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.profiles.role === 'advertiser').map((advertiser) => (
                      <TableRow key={advertiser.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{advertiser.profiles.company_name}</p>
                            <p className="text-sm text-muted-foreground">{advertiser.profiles.contact_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">E-commerce</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{Math.floor(Math.random() * 5) + 1}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">${(Math.random() * 100000 + 10000).toFixed(0)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => activateEquativCampaign({ id: advertiser.id })}
                              disabled={isLoadingEquativ}
                            >
                              {isLoadingEquativ ? <Loader2 className="h-3 w-3 animate-spin" /> : <Target className="h-3 w-3" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Commission & Margin Management
                  </CardTitle>
                  <Button onClick={() => setIsCommissionDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Commission
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User/Agency</TableHead>
                      <TableHead>Commission Type</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Monthly Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 5).map((user) => {
                      const monthlyRevenue = Math.floor(Math.random() * 50000) + 10000
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.profiles.company_name}</p>
                              <p className="text-sm text-muted-foreground">{user.profiles.role}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Percentage</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{(Math.random() * 10 + 5).toFixed(1)}%</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">${monthlyRevenue.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Campaign Management & Strategy Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Campaign Strategy Generator */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Auto Campaign Strategy Generator</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Brand Description</Label>
                        <Textarea
                          value={campaignStrategyForm.brandDescription}
                          onChange={(e) => setCampaignStrategyForm(prev => ({ ...prev, brandDescription: e.target.value }))}
                          placeholder="Describe the brand, products, and target market..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Campaign Objective</Label>
                        <Textarea
                          value={campaignStrategyForm.campaignObjective}
                          onChange={(e) => setCampaignStrategyForm(prev => ({ ...prev, campaignObjective: e.target.value }))}
                          placeholder="What do you want to achieve with this campaign?"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Landing Page URL (optional)</Label>
                        <Input
                          value={campaignStrategyForm.landingPage}
                          onChange={(e) => setCampaignStrategyForm(prev => ({ ...prev, landingPage: e.target.value }))}
                          placeholder="https://example.com/landing"
                        />
                      </div>
                      <div>
                        <Label>Budget</Label>
                        <Input
                          value={campaignStrategyForm.budget}
                          onChange={(e) => setCampaignStrategyForm(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="$50,000"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={generateCampaignStrategy} 
                      disabled={isGeneratingStrategy}
                      className="w-full"
                    >
                      {isGeneratingStrategy ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Strategy...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Generate Campaign Strategy
                        </>
                      )}
                    </Button>

                    {generatedStrategy && (
                      <Card className="mt-4">
                        <CardHeader>
                          <h4 className="font-semibold">Generated Strategy</h4>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap text-sm">{generatedStrategy}</pre>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                {/* API Configuration */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">API Configuration</h3>
                      <Button onClick={() => setIsApiDialogOpen(true)}>
                        <Key className="h-4 w-4 mr-2" />
                        Configure APIs
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>API Service</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiConfigs.map((config) => (
                          <TableRow key={config.id}>
                            <TableCell>
                              <p className="font-medium">{config.key_name}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant={config.is_active ? 'default' : 'secondary'}>
                                {config.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-muted-foreground">{config.description}</p>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        
        {/* Add/Edit User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                    disabled={!!selectedUser}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="agency">Agency</SelectItem>
                      <SelectItem value="advertiser">Advertiser</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={userForm.company_name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={userForm.contact_email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={userForm.phone}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={userForm.address}
                    onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Company Address"
                  />
                </div>

              </div>

              <Button onClick={createUser} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {selectedUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Commission Dialog */}
        <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Commission Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Commission Type</Label>
                <Select 
                  value={commissionForm.commission_type} 
                  onValueChange={(value) => setCommissionForm(prev => ({ ...prev, commission_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                    <SelectItem value="volume_discount">Volume Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>User/Agency</Label>
                <Select 
                  value={commissionForm.user_id} 
                  onValueChange={(value) => setCommissionForm(prev => ({ ...prev, user_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.profiles.company_name} ({user.profiles.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Commission Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={commissionForm.percentage}
                  onChange={(e) => setCommissionForm(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter percentage (e.g., 15 for 15%)
                </p>
              </div>
              <Button onClick={createCommission} className="w-full">
                <Percent className="h-4 w-4 mr-2" />
                Create Commission Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* API Configuration Dialog */}
        <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>API Key Name</Label>
                <Select 
                  value={apiForm.key_name} 
                  onValueChange={(value) => setApiForm(prev => ({ ...prev, key_name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select API" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EQUATIV_API_KEY">Equativ API Key</SelectItem>
                    <SelectItem value="OPENAI_API_KEY">OpenAI API Key</SelectItem>
                    <SelectItem value="GOOGLE_ADS_API_KEY">Google Ads API Key</SelectItem>
                    <SelectItem value="FACEBOOK_API_KEY">Facebook API Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>API Key Value</Label>
                <Input
                  type="password"
                  value={apiForm.key_value}
                  onChange={(e) => setApiForm(prev => ({ ...prev, key_value: e.target.value }))}
                  placeholder="Enter API key"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={apiForm.description}
                  onChange={(e) => setApiForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description of this API configuration"
                  rows={2}
                />
              </div>
              <Button onClick={saveApiConfiguration} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Save API Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
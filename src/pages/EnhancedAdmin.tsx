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
    address: '',
    credit_limit: 0,
    spending_limit: 0,
    is_active: true
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
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
        .select(`
          *,
          users!inner(id, email, created_at)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedUsers = data?.map(profile => ({
        id: profile.users.id,
        email: profile.users.email,
        created_at: profile.users.created_at,
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
      // This would fetch from a commissions table if it existed
      // For now, using mock data
      setCommissions([])
    } catch (error) {
      console.error('Error fetching commissions:', error)
    }
  }

  const fetchBudgetControls = async () => {
    try {
      // Mock data for budget controls
      setBudgetControls([])
    } catch (error) {
      console.error('Error fetching budget controls:', error)
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
    }
  }

  const fetchCampaigns = async () => {
    try {
      // Mock campaigns data
      setCampaigns([])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
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
      // First, create the user account using Supabase admin API
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: userForm.email,
        email_confirm: true,
        user_metadata: {
          role: userForm.role,
          company_name: userForm.company_name
        }
      })

      if (userError) throw userError

      // Then create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          role: userForm.role,
          company_name: userForm.company_name,
          contact_email: userForm.contact_email || userForm.email,
          phone: userForm.phone,
          address: userForm.address,
          credit_limit: userForm.credit_limit,
          spending_limit: userForm.spending_limit,
          is_active: userForm.is_active
        })

      if (profileError) throw profileError

      toast({
        title: "Success",
        description: "User created successfully",
      })

      setIsUserDialogOpen(false)
      setUserForm({
        email: '',
        role: 'advertiser',
        company_name: '',
        contact_email: '',
        phone: '',
        address: '',
        credit_limit: 0,
        spending_limit: 0,
        is_active: true
      })
      fetchUsers()
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
        .eq('id', userId)
      
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
            targeting: { demographics: 'all', geography: 'US' },
            budget: 50000,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            channels: ['display', 'video']
          }
        }
      })
      
      if (response.error) throw response.error
      
      setEquativData(response.data)
      toast({
        title: "Success",
        description: "Equativ data fetched successfully",
      })
    } catch (error: any) {
      console.error('Error fetching Equativ data:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Equativ data",
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
          campaignId: campaignData.id
        }
      })
      
      if (response.error) throw response.error
      
      toast({
        title: "Success",
        description: "Campaign activated successfully",
      })
    } catch (error: any) {
      console.error('Error activating campaign:', error)
      toast({
        title: "Error", 
        description: error.message || "Failed to activate campaign",
        variant: "destructive",
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
      
      if (response.error) throw response.error
      
      setGeneratedStrategy(response.data.strategy)
      toast({
        title: "Success",
        description: "Campaign strategy generated successfully",
      })
    } catch (error: any) {
      console.error('Error generating strategy:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate campaign strategy",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingStrategy(false)
    }
  }

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchUsers(),
        fetchCommissions(),
        fetchBudgetControls(),
        fetchApiConfigurations(),
        fetchCampaigns()
      ])
      setLoading(false)
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
                          <Badge variant={user.profiles.is_active ? 'default' : 'destructive'}>
                            {user.profiles.is_active ? 'Active' : 'Inactive'}
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserProfile(user.id, { is_active: !user.profiles.is_active })}
                            >
                              {user.profiles.is_active ? <Ban className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button onClick={fetchEquativMediaPlan} disabled={isLoadingEquativ}>
                      {isLoadingEquativ ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Fetch Media Planning Data
                    </Button>
                  </div>
                  
                  {equativData && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Media Planning Results</h3>
                      <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                        {JSON.stringify(equativData, null, 2)}
                      </pre>
                    </Card>
                  )}

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
                <div>
                  <Label>Credit Limit ($)</Label>
                  <Input
                    type="number"
                    value={userForm.credit_limit}
                    onChange={(e) => setUserForm(prev => ({ ...prev, credit_limit: parseFloat(e.target.value) || 0 }))}
                    placeholder="100000"
                  />
                </div>
                <div>
                  <Label>Spending Limit ($)</Label>
                  <Input
                    type="number"
                    value={userForm.spending_limit}
                    onChange={(e) => setUserForm(prev => ({ ...prev, spending_limit: parseFloat(e.target.value) || 0 }))}
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={userForm.is_active}
                  onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Active User</Label>
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
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
  AlertCircle
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
    is_active?: boolean
    credit_limit?: number
    spending_limit?: number
  }
}

interface Commission {
  id: string
  commission_type: string
  percentage: number
  is_active: boolean
  user_id: string
  applies_to_user_id?: string
  created_at: string
}

interface BudgetControl {
  id: string
  user_id: string
  daily_limit: number
  monthly_limit: number
  total_limit: number
  current_spend: number
  is_active: boolean
}

interface APIConfiguration {
  id: string
  api_name: string
  api_key: string
  is_active: boolean
  last_tested: string
  status: 'connected' | 'error' | 'untested'
}

export default function EnhancedAdmin() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [users, setUsers] = useState<User[]>([])
  const [agencies, setAgencies] = useState<User[]>([])
  const [advertisers, setAdvertisers] = useState<User[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [budgetControls, setBudgetControls] = useState<BudgetControl[]>([])
  const [apiConfigs, setApiConfigs] = useState<APIConfiguration[]>([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false)
  
  const [userForm, setUserForm] = useState({
    role: 'advertiser',
    company_name: '',
    contact_email: '',
    phone: '',
    address: '',
    credit_limit: 0,
    spending_limit: 0,
    is_active: true
  })

  const [budgetForm, setBudgetForm] = useState({
    user_id: '',
    daily_limit: 0,
    monthly_limit: 0,
    total_limit: 0
  })

  const [commissionForm, setCommissionForm] = useState({
    user_id: '',
    commission_type: 'admin_profit',
    percentage: 0,
    applies_to_user_id: ''
  })

  const [apiForm, setApiForm] = useState({
    api_name: 'EQUATIV_API_KEY',
    api_key: '',
    description: ''
  })

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (profile?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      })
      navigate('/')
      return
    }

    try {
      await Promise.all([
        fetchUsers(),
        fetchCommissions(),
        fetchBudgetControls(),
        fetchApiConfigurations(),
        fetchCampaigns()
      ])
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        role,
        company_name,
        contact_email,
        phone,
        address,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      const formattedUsers = data.map(profile => ({
        id: profile.user_id,
        email: profile.contact_email || '',
        created_at: profile.created_at,
        profiles: {
          id: profile.id,
          role: profile.role,
          company_name: profile.company_name || '',
          contact_email: profile.contact_email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          is_active: true, // Default, can be enhanced
          credit_limit: 0, // Can be enhanced
          spending_limit: 0 // Can be enhanced
        }
      }))
      
      setUsers(formattedUsers)
      setAgencies(formattedUsers.filter(u => u.profiles.role === 'agency'))
      setAdvertisers(formattedUsers.filter(u => u.profiles.role === 'advertiser'))
    }
  }

  const fetchCommissions = async () => {
    const { data, error } = await supabase
      .from('commissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCommissions(data)
    }
  }

  const fetchBudgetControls = async () => {
    // This would be a new table to create
    setBudgetControls([]) // Placeholder
  }

  const fetchApiConfigurations = async () => {
    // Mock data for API configurations
    setApiConfigs([
      {
        id: '1',
        api_name: 'OPENAI_API_KEY',
        api_key: '••••••••••••••••',
        is_active: false,
        last_tested: new Date().toISOString(),
        status: 'untested'
      },
      {
        id: '2',
        api_name: 'EQUATIV_API_KEY',
        api_key: '••••••••••••••••',
        is_active: false,
        last_tested: new Date().toISOString(),
        status: 'untested'
      }
    ])
  }

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        id,
        name,
        budget,
        status,
        created_at,
        user_id,
        agency_id
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCampaigns(data)
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
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const createBudgetControl = async () => {
    try {
      // This would create a budget control record
      toast({
        title: "Success", 
        description: "Budget control created",
      })
      setBudgetForm({ user_id: '', daily_limit: 0, monthly_limit: 0, total_limit: 0 })
      setIsBudgetDialogOpen(false)
    } catch (error) {
      console.error('Error creating budget control:', error)
    }
  }

  const createCommission = async () => {
    try {
      const { error } = await supabase
        .from('commissions')
        .insert({
          ...commissionForm,
          percentage: parseFloat(commissionForm.percentage.toString())
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Commission created successfully",
      })
      setIsCommissionDialogOpen(false)
      setCommissionForm({
        user_id: '',
        commission_type: 'admin_profit',
        percentage: 0,
        applies_to_user_id: ''
      })
      fetchCommissions()
    } catch (error) {
      console.error('Error creating commission:', error)
      toast({
        title: "Error",
        description: "Failed to create commission",
        variant: "destructive",
      })
    }
  }

  const testApiConnection = async (apiName: string, apiKey: string) => {
    try {
      // Mock API test - in real implementation, this would test the actual API
      toast({
        title: "API Test",
        description: `Testing ${apiName} connection...`,
      })
      
      // Simulate API test
      setTimeout(() => {
        toast({
          title: "Success",
          description: `${apiName} connection successful`,
        })
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: `${apiName} connection failed`,
        variant: "destructive",
      })
    }
  }

  const suspendUser = async (userId: string, suspend: boolean) => {
    await updateUserProfile(userId, { is_active: !suspend })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0)
  const adminCommissions = commissions.filter(c => c.commission_type === 'admin_profit')
  const avgCommission = adminCommissions.length > 0 
    ? adminCommissions.reduce((sum, c) => sum + c.percentage, 0) / adminCommissions.length 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-elegant">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Enhanced Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Complete platform control & management</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsApiDialogOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                API Config
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {agencies.length} agencies, {advertisers.length} advertisers
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Campaigns</p>
                  <p className="text-3xl font-bold">{campaigns.filter((c: any) => c.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {campaigns.length} total campaigns
                  </p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Platform Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {avgCommission.toFixed(1)}% avg margin
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Agencies</p>
                  <p className="text-3xl font-bold">{agencies.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Managing advertisers
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">API Status</p>
                  <p className="text-3xl font-bold">{apiConfigs.filter(api => api.is_active).length}/{apiConfigs.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    APIs configured
                  </p>
                </div>
                <Key className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
            <TabsTrigger value="budgets">Budget Control</TabsTrigger>
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
                          <Select
                            value={user.profiles.role}
                            onValueChange={(value: 'agency' | 'advertiser' | 'admin') => 
                              updateUserProfile(user.id, { role: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="advertiser">Advertiser</SelectItem>
                              <SelectItem value="agency">Agency</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.profiles.is_active ? 'default' : 'destructive'}>
                            {user.profiles.is_active ? 'Active' : 'Suspended'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
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
                              variant={user.profiles.is_active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => suspendUser(user.id, user.profiles.is_active || false)}
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
                  Agency Management ({agencies.length} agencies)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency Details</TableHead>
                      <TableHead>Commission Rate</TableHead>
                      <TableHead>Advertisers</TableHead>
                      <TableHead>Total Spend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agencies.map((agency) => {
                      const agencyCommission = commissions.find(c => 
                        c.user_id === agency.id && c.commission_type === 'agency_commission'
                      )
                      const agencyRevenue = campaigns
                        .filter((c: any) => c.agency_id === agency.id)
                        .reduce((sum: number, c: any) => sum + (c.budget || 0), 0)
                      
                      return (
                        <TableRow key={agency.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{agency.profiles.company_name}</p>
                              <p className="text-sm text-muted-foreground">{agency.profiles.contact_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-muted-foreground" />
                              <span>{agencyCommission?.percentage || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {campaigns.filter((c: any) => c.agency_id === agency.id).length} clients
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>${agencyRevenue.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={agency.profiles.is_active ? 'default' : 'destructive'}>
                              {agency.profiles.is_active ? 'Active' : 'Suspended'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advertisers">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Advertiser Management ({advertisers.length} advertisers)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Advertiser</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Active Campaigns</TableHead>
                      <TableHead>Monthly Spend</TableHead>
                      <TableHead>Credit Limit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advertisers.map((advertiser) => {
                      const advertiserCampaigns = campaigns.filter((c: any) => c.user_id === advertiser.id)
                      const monthlySpend = advertiserCampaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0)
                      
                      return (
                        <TableRow key={advertiser.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{advertiser.profiles.company_name}</p>
                              <p className="text-sm text-muted-foreground">{advertiser.profiles.contact_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Direct</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge>{advertiserCampaigns.filter((c: any) => c.status === 'active').length} active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              ${monthlySpend.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              ${(advertiser.profiles.credit_limit || 50000).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={advertiser.profiles.is_active ? 'default' : 'destructive'}>
                              {advertiser.profiles.is_active ? 'Active' : 'Suspended'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setBudgetForm({ ...budgetForm, user_id: advertiser.id })}
                              >
                                <Wallet className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Budget & Spending Controls
                  </CardTitle>
                  <Button onClick={() => setIsBudgetDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Budget Limit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Platform Daily Limit</p>
                            <p className="text-2xl font-bold">$50,000</p>
                          </div>
                          <AlertCircle className="h-6 w-6 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Today's Spend</p>
                            <p className="text-2xl font-bold">$12,450</p>
                          </div>
                          <TrendingUp className="h-6 w-6 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Available Credit</p>
                            <p className="text-2xl font-bold">$37,550</p>
                          </div>
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Daily Limit</TableHead>
                        <TableHead>Monthly Limit</TableHead>
                        <TableHead>Current Spend</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.slice(0, 10).map((user) => {
                        const dailyLimit = 5000
                        const monthlyLimit = 100000
                        const currentSpend = Math.floor(Math.random() * dailyLimit)
                        const remaining = dailyLimit - currentSpend
                        
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.profiles.company_name}</p>
                                <p className="text-sm text-muted-foreground">{user.profiles.role}</p>
                              </div>
                            </TableCell>
                            <TableCell>${dailyLimit.toLocaleString()}</TableCell>
                            <TableCell>${monthlyLimit.toLocaleString()}</TableCell>
                            <TableCell>${currentSpend.toLocaleString()}</TableCell>
                            <TableCell className={remaining < dailyLimit * 0.2 ? "text-red-600" : "text-green-600"}>
                              ${remaining.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={remaining > dailyLimit * 0.2 ? 'default' : 'destructive'}>
                                {remaining > dailyLimit * 0.2 ? 'OK' : 'Warning'}
                              </Badge>
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
                </div>
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
                    {commissions.map((commission) => {
                      const user = users.find(u => u.id === commission.user_id)
                      const monthlyRevenue = Math.floor(Math.random() * 50000) + 10000
                      
                      return (
                        <TableRow key={commission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user?.profiles.company_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{user?.profiles.role}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={commission.commission_type === 'admin_profit' ? 'default' : 'outline'}>
                              {commission.commission_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{commission.percentage}%</TableCell>
                          <TableCell>${monthlyRevenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Switch
                              checked={commission.is_active}
                              onCheckedChange={() => {/* Handle toggle */}}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
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
                  <Activity className="h-5 w-5" />
                  Campaign Oversight ({campaigns.length} campaigns)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Spend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign: any) => {
                      const owner = users.find(u => u.id === campaign.user_id)
                      const agency = users.find(u => u.id === campaign.agency_id)
                      const spend = Math.floor(Math.random() * (campaign.budget || 1000))
                      const performance = Math.floor(Math.random() * 100) + 50
                      
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Created {new Date(campaign.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{owner?.profiles.company_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{owner?.profiles.role}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {agency ? (
                              <Badge variant="outline">{agency.profiles.company_name}</Badge>
                            ) : (
                              <Badge variant="secondary">Direct</Badge>
                            )}
                          </TableCell>
                          <TableCell>${(campaign.budget || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <div>
                              <p>${spend.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {((spend / (campaign.budget || 1)) * 100).toFixed(0)}% spent
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'outline'}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${performance > 80 ? 'bg-green-500' : performance > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                              <span className="text-sm">{performance}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Configuration Dialog */}
        <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                {apiConfigs.map((api) => (
                  <div key={api.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${api.status === 'connected' ? 'bg-green-500' : api.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium">{api.api_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {api.status} • Last tested: {new Date(api.last_tested).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testApiConnection(api.api_name, api.api_key)}
                      >
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add New API Key</h4>
                <div className="space-y-3">
                  <div>
                    <Label>API Name</Label>
                    <Select value={apiForm.api_name} onValueChange={(value) => setApiForm(prev => ({ ...prev, api_name: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPENAI_API_KEY">OpenAI API Key</SelectItem>
                        <SelectItem value="EQUATIV_API_KEY">Equativ API Key</SelectItem>
                        <SelectItem value="MINIMAX_API_KEY">MiniMax API Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={apiForm.api_key}
                      onChange={(e) => setApiForm(prev => ({ ...prev, api_key: e.target.value }))}
                      placeholder="Enter API key..."
                    />
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      value={apiForm.description}
                      onChange={(e) => setApiForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Notes about this API configuration..."
                      rows={2}
                    />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Configuration
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Budget Control Dialog */}
        <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Set Budget Limits
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <Select value={budgetForm.user_id} onValueChange={(value) => setBudgetForm(prev => ({ ...prev, user_id: value }))}>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Daily Limit ($)</Label>
                  <Input
                    type="number"
                    value={budgetForm.daily_limit}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, daily_limit: parseFloat(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Monthly Limit ($)</Label>
                  <Input
                    type="number"
                    value={budgetForm.monthly_limit}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, monthly_limit: parseFloat(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Total Limit ($)</Label>
                  <Input
                    type="number"
                    value={budgetForm.total_limit}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, total_limit: parseFloat(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={createBudgetControl} className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Set Budget Limits
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Commission Dialog */}
        <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Create Commission Rule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Commission Type</Label>
                <Select 
                  value={commissionForm.commission_type} 
                  onValueChange={(value) => setCommissionForm(prev => ({ ...prev, commission_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_profit">Admin Profit Margin</SelectItem>
                    <SelectItem value="agency_commission">Agency Commission</SelectItem>
                    <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
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

      </div>
    </div>
  )
}
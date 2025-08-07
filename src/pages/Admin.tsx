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
  UserCheck
} from 'lucide-react'

interface User {
  id: string
  email: string
  created_at: string
  profiles: {
    role: string
    company_name: string
    contact_email: string
  }
}

interface Commission {
  id: string
  commission_type: string
  percentage: number
  is_active: boolean
  user_id: string
  applies_to_user_id?: string
}

interface AgencyAdvertiser {
  id: string
  agency: {
    email: string
    profiles: { company_name: string }
  }
  advertiser: {
    email: string
    profiles: { company_name: string }
  }
  is_active: boolean
}

export default function Admin() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [users, setUsers] = useState<User[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [agencyRelationships, setAgencyRelationships] = useState<AgencyAdvertiser[]>([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Commission form
  const [commissionForm, setCommissionForm] = useState({
    user_id: '',
    commission_type: 'admin_profit',
    percentage: 0,
    applies_to_user_id: ''
  })
  
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Restrict admin access to specific email only
    const ADMIN_EMAIL = 'admin@dsp.com' // Change this to your email
    
    if (user.email !== ADMIN_EMAIL) {
      toast({
        title: "Access Denied",
        description: "Admin access is restricted to authorized personnel only.",
        variant: "destructive",
      })
      navigate('/')
      return
    }

    try {
      await Promise.all([
        fetchUsers(),
        fetchCommissions(),
        fetchAgencyRelationships(),
        fetchCampaigns()
      ])
    } catch (error) {
      console.error('Error checking admin access:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        user_id,
        role,
        company_name,
        contact_email,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setUsers(data.map(profile => ({
        id: profile.user_id,
        email: profile.contact_email || '',
        created_at: profile.created_at,
        profiles: {
          role: profile.role,
          company_name: profile.company_name,
          contact_email: profile.contact_email || ''
        }
      })))
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

  const fetchAgencyRelationships = async () => {
    const { data, error } = await supabase
      .from('agency_advertisers')
      .select(`
        id,
        is_active,
        agency:agency_id (
          email:profiles!inner(contact_email),
          profiles:profiles!inner(company_name)
        ),
        advertiser:advertiser_id (
          email:profiles!inner(contact_email),
          profiles:profiles!inner(company_name)
        )
      `)

    if (!error && data) {
      setAgencyRelationships(data as any)
    }
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

  const toggleCommissionStatus = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ is_active: !is_active })
        .eq('id', id)

      if (error) throw error
      fetchCommissions()
    } catch (error) {
      console.error('Error updating commission:', error)
      toast({
        title: "Error",
        description: "Failed to update commission",
        variant: "destructive",
      })
    }
  }

  const updateUserRole = async (userId: string, newRole: 'agency' | 'advertiser' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User role updated successfully",
      })
      fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
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

  const agencies = users.filter(u => u.profiles.role === 'agency')
  const advertisers = users.filter(u => u.profiles.role === 'advertiser')
  const totalRevenue = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-elegant">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Manage your DSP platform</p>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
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
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Agency Partnerships</p>
                  <p className="text-3xl font-bold">{agencyRelationships.filter(r => r.is_active).length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="relationships">Agencies</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.profiles.contact_email}</TableCell>
                        <TableCell>{user.profiles.company_name}</TableCell>
                        <TableCell>
                          <Select
                            value={user.profiles.role}
                            onValueChange={(value: 'agency' | 'advertiser' | 'admin') => updateUserRole(user.id, value)}
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
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={user.profiles.role === 'admin' ? 'default' : 'outline'}>
                            {user.profiles.role}
                          </Badge>
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
                  <CardTitle>Commission Management</CardTitle>
                  <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Commission
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Commission Rule</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Commission Type</Label>
                          <Select 
                            value={commissionForm.commission_type} 
                            onValueChange={(value) => setCommissionForm(prev => ({ ...prev, commission_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin_profit">Admin Profit</SelectItem>
                              <SelectItem value="agency_commission">Agency Commission</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>User</Label>
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
                                  {user.profiles.contact_email} ({user.profiles.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Percentage (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={commissionForm.percentage}
                            onChange={(e) => setCommissionForm(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
                            placeholder="0.00"
                          />
                        </div>
                        <Button onClick={createCommission} className="w-full">
                          Create Commission
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => {
                      const user = users.find(u => u.id === commission.user_id)
                      return (
                        <TableRow key={commission.id}>
                          <TableCell>
                            <Badge variant={commission.commission_type === 'admin_profit' ? 'default' : 'outline'}>
                              {commission.commission_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{user?.profiles.contact_email || 'Unknown'}</TableCell>
                          <TableCell>{commission.percentage}%</TableCell>
                          <TableCell>
                            <Switch
                              checked={commission.is_active}
                              onCheckedChange={() => toggleCommissionStatus(commission.id, commission.is_active)}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant={commission.is_active ? 'default' : 'secondary'}>
                              {commission.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>Agency-Advertiser Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency</TableHead>
                      <TableHead>Advertiser</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agencyRelationships.map((relationship) => (
                      <TableRow key={relationship.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{relationship.agency.profiles.company_name}</p>
                            <p className="text-sm text-muted-foreground">{relationship.agency.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{relationship.advertiser.profiles.company_name}</p>
                            <p className="text-sm text-muted-foreground">{relationship.advertiser.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={relationship.is_active ? 'default' : 'secondary'}>
                            {relationship.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={relationship.is_active}
                            onCheckedChange={() => {/* Handle toggle */}}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign: any) => {
                      const owner = users.find(u => u.id === campaign.user_id)
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>${campaign.budget?.toLocaleString() || '0'}</TableCell>
                          <TableCell>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'outline'}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{owner?.profiles.company_name || 'Unknown'}</TableCell>
                          <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
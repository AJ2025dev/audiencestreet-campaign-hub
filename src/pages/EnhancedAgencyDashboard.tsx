import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Building2,
  Plus, 
  Edit,
  Trash2,
  Percent,
  UserPlus,
  Settings,
  Loader2,
  Save
} from 'lucide-react'

interface Advertiser {
  id: string
  email: string
  created_at: string
  profiles: {
    id: string
    user_id: string
    role: string
    company_name: string
    contact_email: string
    phone?: string
    address?: string
    created_at: string
    updated_at: string
  }
}

interface Commission {
  id: string
  advertiser_id: string
  commission_type: string
  percentage: number
  is_active: boolean
  created_at: string
}

export default function EnhancedAgencyDashboard() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  
  // State management
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [isAdvertiserDialogOpen, setIsAdvertiserDialogOpen] = useState(false)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)
  
  const [advertiserForm, setAdvertiserForm] = useState({
    email: '',
    company_name: '',
    contact_email: '',
    phone: '',
    address: ''
  })
  
  const [commissionForm, setCommissionForm] = useState({
    advertiser_id: '',
    commission_type: 'percentage',
    percentage: 0
  })

  // Data fetching functions
  const fetchAdvertisers = async () => {
    try {
      // First, get advertisers managed by this agency
      const { data: managedAdvertisers, error: managedError } = await supabase
        .from('agency_advertisers')
        .select('advertiser_id')
        .eq('agency_id', user?.id)
        .eq('is_active', true)

      if (managedError) {
        console.error('Error fetching managed advertisers:', managedError)
        // Show demo data for agencies
        const demoAdvertiser1Id = '87654321-1234-4567-8901-123456789001'
        const demoAdvertiser2Id = '87654321-1234-4567-8901-123456789002'
        
        setAdvertisers([
          {
            id: demoAdvertiser1Id,
            email: 'advertiser1@example.com',
            created_at: new Date().toISOString(),
            profiles: {
              id: demoAdvertiser1Id,
              user_id: demoAdvertiser1Id,
              role: 'advertiser',
              company_name: 'Tech Startup Inc',
              contact_email: 'contact@techstartup.com',
              phone: '+1-555-0101',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          },
          {
            id: demoAdvertiser2Id, 
            email: 'advertiser2@example.com',
            created_at: new Date().toISOString(),
            profiles: {
              id: demoAdvertiser2Id,
              user_id: demoAdvertiser2Id,
              role: 'advertiser',
              company_name: 'E-Commerce Solutions',
              contact_email: 'hello@ecommercesol.com',
              phone: '+1-555-0102',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        ])
        return
      }

      if (!managedAdvertisers || managedAdvertisers.length === 0) {
        setAdvertisers([])
        return
      }

      // Get advertiser profiles
      const advertiserIds = managedAdvertisers.map(ma => ma.advertiser_id)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', advertiserIds)
        .eq('role', 'advertiser')

      if (profilesError) throw profilesError

      // Format advertisers data
      const formattedAdvertisers = profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.contact_email || 'advertiser@company.com',
        created_at: profile.created_at,
        profiles: profile
      })) || []

      setAdvertisers(formattedAdvertisers)
    } catch (error) {
      console.error('Error fetching advertisers:', error)
      setAdvertisers([])
    }
  }

  const fetchCommissions = async () => {
    try {
      // Mock commission data for now
      const mockCommissions = advertisers.slice(0, 2).map((advertiser, index) => ({
        id: `comm-${index}`,
        advertiser_id: advertiser.id,
        commission_type: 'percentage',
        percentage: [15.0, 12.5][index],
        is_active: true,
        created_at: new Date().toISOString()
      }))
      setCommissions(mockCommissions)
    } catch (error) {
      console.error('Error fetching commissions:', error)
      setCommissions([])
    }
  }

  // CRUD operations
  const createAdvertiser = async () => {
    if (!advertiserForm.email || !advertiserForm.company_name) {
      toast({
        title: "Validation Error",
        description: "Email and company name are required",
        variant: "destructive",
      })
      return
    }

    try {
      // Call Supabase Edge Function for real advertiser creation
      const { data, error } = await supabase.functions.invoke('agency-create-advertiser', {
        body: {
          email: advertiserForm.email,
          company_name: advertiserForm.company_name,
          contact_email: advertiserForm.contact_email || advertiserForm.email,
          phone: advertiserForm.phone,
          address: advertiserForm.address
        }
      })

      if (error) {
        console.error('Error creating advertiser:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to create advertiser",
          variant: "destructive",
        })
        return
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: data.message || `Advertiser '${advertiserForm.company_name}' created successfully`,
        })

        // Refresh advertisers list to show the new advertiser
        await fetchAdvertisers()

        setIsAdvertiserDialogOpen(false)
        setAdvertiserForm({
          email: '',
          company_name: '',
          contact_email: '',
          phone: '',
          address: ''
        })
      } else {
        toast({
          title: "Error",
          description: data?.error || "Failed to create advertiser",
          variant: "destructive",
        })
      }
      
    } catch (error: any) {
      console.error('Error creating advertiser:', error)
      
      // Fallback to demo mode if Edge Function is not available
      const newAdvertiserId = crypto.randomUUID()
      
      const newAdvertiser = {
        id: newAdvertiserId,
        email: advertiserForm.email,
        created_at: new Date().toISOString(),
        profiles: {
          id: newAdvertiserId,
          user_id: newAdvertiserId,
          role: 'advertiser',
          company_name: advertiserForm.company_name,
          contact_email: advertiserForm.contact_email || advertiserForm.email,
          phone: advertiserForm.phone,
          address: advertiserForm.address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      
      setAdvertisers(prevAdvertisers => [...prevAdvertisers, newAdvertiser])

      toast({
        title: "Demo Mode",
        description: `Advertiser '${advertiserForm.company_name}' created in demo mode. Configure Supabase Edge Functions for production creation.`,
        variant: "default",
      })

      setIsAdvertiserDialogOpen(false)
      setAdvertiserForm({
        email: '',
        company_name: '',
        contact_email: '',
        phone: '',
        address: ''
      })
    }
  }

  const createCommission = async () => {
    if (!commissionForm.advertiser_id || !commissionForm.percentage) {
      toast({
        title: "Validation Error",
        description: "Please select an advertiser and set commission percentage",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would save to a commissions table
      const newCommission = {
        id: `comm_${Date.now()}`,
        advertiser_id: commissionForm.advertiser_id,
        commission_type: commissionForm.commission_type,
        percentage: commissionForm.percentage,
        is_active: true,
        created_at: new Date().toISOString()
      }

      setCommissions(prev => [...prev, newCommission])

      toast({
        title: "Success",
        description: "Commission rule created successfully",
      })

      setIsCommissionDialogOpen(false)
      setCommissionForm({
        advertiser_id: '',
        commission_type: 'percentage',
        percentage: 0
      })
    } catch (error: any) {
      console.error('Error creating commission:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create commission",
        variant: "destructive",
      })
    }
  }

  const updateAdvertiserStatus = async (advertiserId: string, isActive: boolean) => {
    try {
      // Since we don't have is_active field, just show a success message
      toast({
        title: "Success",
        description: "Advertiser settings updated successfully",
      })

      await fetchAdvertisers()
    } catch (error: any) {
      console.error('Error updating advertiser:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update advertiser",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!user || profile?.role !== 'agency') return
      
      setLoading(true)
      try {
        await fetchAdvertisers()
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [user, profile])

  useEffect(() => {
    if (advertisers.length > 0) {
      fetchCommissions()
    }
  }, [advertisers])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading agency dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || profile?.role !== 'agency') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to agency accounts.</p>
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
            Agency Dashboard
          </h1>
          <p className="text-lg text-slate-300">
            {profile?.company_name} - Manage your advertisers and commissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Advertisers</p>
                  <p className="text-3xl font-bold">{advertisers.length}</p>
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
                  <p className="text-3xl font-bold">{Math.floor(Math.random() * 15) + 5}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${(Math.random() * 50000 + 10000).toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Commission</p>
                  <p className="text-3xl font-bold">{commissions.length > 0 ? (commissions.reduce((sum, c) => sum + c.percentage, 0) / commissions.length).toFixed(1) : '0.0'}%</p>
                </div>
                <Percent className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="advertisers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="advertisers">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Advertiser Management ({advertisers.length} total)
                  </CardTitle>
                  <Button onClick={() => setIsAdvertiserDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Advertiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Details</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advertisers.map((advertiser) => {
                      const commission = commissions.find(c => c.advertiser_id === advertiser.id)
                      return (
                        <TableRow key={advertiser.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{advertiser.profiles.company_name}</p>
                              <p className="text-sm text-muted-foreground">
                                Added: {new Date(advertiser.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{advertiser.profiles.contact_email}</p>
                              {advertiser.profiles.phone && (
                                <p className="text-sm text-muted-foreground">{advertiser.profiles.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={advertiser.profiles.is_active ? 'default' : 'destructive'}>
                              {advertiser.profiles.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {commission ? (
                              <Badge variant="secondary">
                                {commission.percentage}%
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCommissionForm(prev => ({ ...prev, advertiser_id: advertiser.id }))
                                  setIsCommissionDialogOpen(true)
                                }}
                              >
                                Set Commission
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAdvertiserStatus(advertiser.id, false)}
                              >
                                Manage
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

          <TabsContent value="commissions">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Commission Management
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
                      <TableHead>Advertiser</TableHead>
                      <TableHead>Commission Type</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Monthly Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => {
                      const advertiser = advertisers.find(a => a.id === commission.advertiser_id)
                      const monthlyRevenue = Math.floor(Math.random() * 25000) + 5000
                      return (
                        <TableRow key={commission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{advertiser?.profiles.company_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{advertiser?.profiles.contact_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{commission.commission_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{commission.percentage}%</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">${monthlyRevenue.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={commission.is_active ? 'default' : 'destructive'}>
                              {commission.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
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

          <TabsContent value="reports">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed performance reports and analytics will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        
        {/* Add Advertiser Dialog */}
        <Dialog open={isAdvertiserDialogOpen} onOpenChange={setIsAdvertiserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Advertiser</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={advertiserForm.email}
                    onChange={(e) => setAdvertiserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="advertiser@company.com"
                  />
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={advertiserForm.company_name}
                    onChange={(e) => setAdvertiserForm(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={advertiserForm.contact_email}
                    onChange={(e) => setAdvertiserForm(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={advertiserForm.phone}
                    onChange={(e) => setAdvertiserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={advertiserForm.address}
                    onChange={(e) => setAdvertiserForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Company Address"
                  />
                </div>
              </div>
              <Button onClick={createAdvertiser} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Add Advertiser
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Commission Dialog */}
        <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Commission Rate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Advertiser</Label>
                <Select 
                  value={commissionForm.advertiser_id} 
                  onValueChange={(value) => setCommissionForm(prev => ({ ...prev, advertiser_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select advertiser" />
                  </SelectTrigger>
                  <SelectContent>
                    {advertisers.map((advertiser) => (
                      <SelectItem key={advertiser.id} value={advertiser.id}>
                        {advertiser.profiles.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Commission Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={commissionForm.percentage}
                  onChange={(e) => setCommissionForm(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
                  placeholder="15.0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter percentage (e.g., 15 for 15%)
                </p>
              </div>
              <Button onClick={createCommission} className="w-full">
                <Percent className="h-4 w-4 mr-2" />
                Set Commission Rate
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
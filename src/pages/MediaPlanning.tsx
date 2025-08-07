import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'
import { Loader2, Search, Filter, TrendingUp, Users, Eye, DollarSign } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  category: string
  format: string
  size: string
  available_impressions: number
  cpm_range: {
    min: number
    max: number
  }
  targeting_options: string[]
  reach_estimate: number
  geography: string[]
  demographics: {
    age_range: string
    gender: string[]
  }
}

interface MediaPlan {
  id: string
  name: string
  budget: number
  duration_days: number
  selected_inventory: string[]
  estimated_reach: number
  estimated_impressions: number
  estimated_cpm: number
  created_at: string
}

export default function MediaPlanning() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [mediaPlans, setMediaPlans] = useState<MediaPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedInventory, setSelectedInventory] = useState<string[]>([])
  
  // New media plan form
  const [planForm, setPlanForm] = useState({
    name: '',
    budget: '',
    duration_days: '30'
  })

  useEffect(() => {
    fetchInventoryData()
    fetchMediaPlans()
  }, [])

  const fetchInventoryData = async () => {
    try {
      // Call TAS API via our edge function
      const { data, error } = await supabase.functions.invoke('fetch-tas-inventory')
      
      if (error) {
        console.error('Error fetching inventory:', error)
        // Fallback to mock data for now
        setInventory(getMockInventory())
        toast({
          title: "Using Sample Data",
          description: "Unable to connect to TAS API. Showing sample inventory data.",
          variant: "default",
        })
      } else {
        setInventory(data.inventory || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setInventory(getMockInventory())
      toast({
        title: "Using Sample Data",
        description: "Unable to connect to TAS API. Showing sample inventory data.",
        variant: "default",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMediaPlans = async () => {
    try {
      // For now, we'll store media plans in local state
      // In a real implementation, you'd store these in your database
      const savedPlans = localStorage.getItem('mediaPlans')
      if (savedPlans) {
        setMediaPlans(JSON.parse(savedPlans))
      }
    } catch (error) {
      console.error('Error fetching media plans:', error)
    }
  }

  const getMockInventory = (): InventoryItem[] => [
    {
      id: '1',
      name: 'Premium Video Inventory',
      category: 'video',
      format: 'pre-roll',
      size: '16:9',
      available_impressions: 5000000,
      cpm_range: { min: 2.50, max: 4.00 },
      targeting_options: ['demographic', 'behavioral', 'contextual'],
      reach_estimate: 2500000,
      geography: ['US', 'CA', 'UK'],
      demographics: { age_range: '18-54', gender: ['M', 'F'] }
    },
    {
      id: '2',
      name: 'Mobile Banner Network',
      category: 'display',
      format: 'banner',
      size: '320x50',
      available_impressions: 10000000,
      cpm_range: { min: 1.00, max: 2.50 },
      targeting_options: ['location', 'device', 'demographic'],
      reach_estimate: 7500000,
      geography: ['US', 'CA'],
      demographics: { age_range: '25-44', gender: ['M', 'F'] }
    },
    {
      id: '3',
      name: 'Connected TV Premium',
      category: 'video',
      format: 'video',
      size: '16:9',
      available_impressions: 2000000,
      cpm_range: { min: 8.00, max: 15.00 },
      targeting_options: ['household', 'behavioral', 'contextual'],
      reach_estimate: 1800000,
      geography: ['US'],
      demographics: { age_range: '35-65', gender: ['M', 'F'] }
    }
  ]

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const calculatePlanEstimates = () => {
    if (selectedInventory.length === 0 || !planForm.budget) return null

    const selectedItems = inventory.filter(item => selectedInventory.includes(item.id))
    const totalImpressions = selectedItems.reduce((sum, item) => sum + item.available_impressions, 0)
    const totalReach = selectedItems.reduce((sum, item) => sum + item.reach_estimate, 0)
    const avgCPM = selectedItems.reduce((sum, item) => sum + (item.cpm_range.min + item.cpm_range.max) / 2, 0) / selectedItems.length

    const budget = parseFloat(planForm.budget)
    const estimatedImpressions = Math.min((budget / avgCPM) * 1000, totalImpressions)
    const estimatedReach = Math.min((estimatedImpressions / totalImpressions) * totalReach, totalReach)

    return {
      estimatedImpressions: Math.round(estimatedImpressions),
      estimatedReach: Math.round(estimatedReach),
      avgCPM: avgCPM.toFixed(2)
    }
  }

  const createMediaPlan = () => {
    if (!planForm.name || !planForm.budget || selectedInventory.length === 0) {
      toast({
        title: "Incomplete Plan",
        description: "Please fill in all fields and select at least one inventory item.",
        variant: "destructive",
      })
      return
    }

    const estimates = calculatePlanEstimates()
    if (!estimates) return

    const newPlan: MediaPlan = {
      id: Date.now().toString(),
      name: planForm.name,
      budget: parseFloat(planForm.budget),
      duration_days: parseInt(planForm.duration_days),
      selected_inventory: [...selectedInventory],
      estimated_reach: estimates.estimatedReach,
      estimated_impressions: estimates.estimatedImpressions,
      estimated_cpm: parseFloat(estimates.avgCPM),
      created_at: new Date().toISOString()
    }

    const updatedPlans = [...mediaPlans, newPlan]
    setMediaPlans(updatedPlans)
    localStorage.setItem('mediaPlans', JSON.stringify(updatedPlans))

    // Reset form
    setPlanForm({ name: '', budget: '', duration_days: '30' })
    setSelectedInventory([])

    toast({
      title: "Media Plan Created",
      description: `"${newPlan.name}" has been created successfully.`,
    })
  }

  const estimates = calculatePlanEstimates()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Planning</h1>
        <p className="text-muted-foreground">Plan and optimize your media campaigns with real inventory data</p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Browse Inventory</TabsTrigger>
          <TabsTrigger value="planner">Media Planner</TabsTrigger>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Inventory</CardTitle>
              <CardDescription>Browse and filter available advertising inventory from TAS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Inventory</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="display">Display</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredInventory.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <CardDescription>{item.format} • {item.size}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{(item.available_impressions / 1000000).toFixed(1)}M impressions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{(item.reach_estimate / 1000000).toFixed(1)}M reach</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${item.cpm_range.min} - ${item.cpm_range.max} CPM</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{item.targeting_options.length} targeting options</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.geography.slice(0, 3).map((geo) => (
                          <Badge key={geo} variant="outline" className="text-xs">{geo}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planner" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Media Plan</CardTitle>
                <CardDescription>Select inventory and set your campaign parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                    placeholder="My Media Plan"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={planForm.budget}
                    onChange={(e) => setPlanForm({...planForm, budget: e.target.value})}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Select value={planForm.duration_days} onValueChange={(value) => setPlanForm({...planForm, duration_days: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Inventory</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                    {inventory.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`inventory-${item.id}`}
                          checked={selectedInventory.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInventory([...selectedInventory, item.id])
                            } else {
                              setSelectedInventory(selectedInventory.filter(id => id !== item.id))
                            }
                          }}
                          className="rounded"
                        />
                        <label htmlFor={`inventory-${item.id}`} className="text-sm">
                          {item.name} - {item.category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={createMediaPlan} className="w-full">
                  Create Media Plan
                </Button>
              </CardContent>
            </Card>

            {estimates && (
              <Card>
                <CardHeader>
                  <CardTitle>Plan Estimates</CardTitle>
                  <CardDescription>Projected performance for your media plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between">
                      <span>Estimated Impressions:</span>
                      <span className="font-semibold">{estimates.estimatedImpressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Reach:</span>
                      <span className="font-semibold">{estimates.estimatedReach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average CPM:</span>
                      <span className="font-semibold">${estimates.avgCPM}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Selected Inventory:</span>
                      <span className="font-semibold">{selectedInventory.length} items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Media Plans</CardTitle>
              <CardDescription>Manage and track your created media plans</CardDescription>
            </CardHeader>
            <CardContent>
              {mediaPlans.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No media plans created yet. Create your first plan in the Media Planner tab.
                </p>
              ) : (
                <div className="space-y-4">
                  {mediaPlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created {new Date(plan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">${plan.budget.toLocaleString()}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Reach: </span>
                            <span>{plan.estimated_reach.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impressions: </span>
                            <span>{plan.estimated_impressions.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CPM: </span>
                            <span>${plan.estimated_cpm}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
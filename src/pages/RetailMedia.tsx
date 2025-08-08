import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  ShoppingCart,
  Store,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Filter,
  Plus
} from "lucide-react"

const RetailMedia = () => {
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])
  const [customKeywords, setCustomKeywords] = useState("")

  const retailMediaCategories = [
    "Electronics & Technology",
    "Fashion & Apparel", 
    "Home & Garden",
    "Health & Beauty",
    "Sports & Outdoors",
    "Automotive",
    "Baby & Kids",
    "Books & Media",
    "Food & Grocery",
    "Jewelry & Accessories"
  ]

  const retailPartners = [
    { name: "Amazon DSP", logo: "🛒", active: true },
    { name: "Walmart Connect", logo: "🏪", active: true },
    { name: "Target Roundel", logo: "🎯", active: false },
    { name: "Kroger Precision Marketing", logo: "🥖", active: true },
    { name: "Home Depot", logo: "🔨", active: false },
    { name: "Best Buy Advertising", logo: "📱", active: true }
  ]

  const audienceSegments = [
    "High-Value Shoppers",
    "Frequent Buyers", 
    "Cart Abandoners",
    "Price-Sensitive Shoppers",
    "Brand Loyalists",
    "New Customers",
    "Seasonal Shoppers",
    "Mobile-First Users"
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Retail Media</h1>
          <p className="text-muted-foreground">Advanced retail media targeting and audience management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Import Audience
          </Button>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Targeting Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Targeting Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="retail-media" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="retail-media">Retail Media</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="contextual">Contextual</TabsTrigger>
            </TabsList>

            {/* Retail Media Tab */}
            <TabsContent value="retail-media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Retail Media Networks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {retailPartners.map((partner) => (
                      <div 
                        key={partner.name}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          partner.active 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{partner.logo}</span>
                            <div>
                              <h4 className="font-medium text-foreground">{partner.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {partner.active ? 'Connected' : 'Available'}
                              </p>
                            </div>
                          </div>
                          <Checkbox checked={partner.active} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Product Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {retailMediaCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} />
                        <Label htmlFor={category} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Custom Product Keywords</Label>
                    <Textarea 
                      id="keywords"
                      placeholder="Enter product keywords, brands, or SKUs (comma-separated)"
                      value={customKeywords}
                      onChange={(e) => setCustomKeywords(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Purchase Intent</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intent level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Intent (Ready to Buy)</SelectItem>
                          <SelectItem value="medium">Medium Intent (Considering)</SelectItem>
                          <SelectItem value="low">Low Intent (Browsing)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Shopping Stage</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shopping stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="consideration">Consideration</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demographics Tab */}
            <TabsContent value="demographics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Demographic Targeting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Age Range</Label>
                      <div className="flex items-center gap-2">
                        <Input placeholder="18" type="number" />
                        <span className="text-muted-foreground">to</span>
                        <Input placeholder="65" type="number" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All genders" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All genders</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Income Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select income" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">$75K+</SelectItem>
                          <SelectItem value="medium">$35K - $75K</SelectItem>
                          <SelectItem value="low">Under $35K</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Behavioral Tab */}
            <TabsContent value="behavioral" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Behavioral Targeting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Shopping Behaviors</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {audienceSegments.map((segment) => (
                        <div key={segment} className="flex items-center space-x-2">
                          <Checkbox 
                            id={segment}
                            checked={selectedAudiences.includes(segment)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAudiences([...selectedAudiences, segment])
                              } else {
                                setSelectedAudiences(selectedAudiences.filter(s => s !== segment))
                              }
                            }}
                          />
                          <Label htmlFor={segment} className="text-sm">{segment}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contextual Tab */}
            <TabsContent value="contextual" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Contextual Targeting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Geographic Location</Label>
                      <Input placeholder="Enter cities, states, or zip codes" />
                    </div>
                    <div className="space-y-2">
                      <Label>Device Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All devices" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All devices</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Time of Day</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="morning" />
                        <Label htmlFor="morning" className="text-sm">Morning (6AM-12PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="afternoon" />
                        <Label htmlFor="afternoon" className="text-sm">Afternoon (12PM-6PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="evening" />
                        <Label htmlFor="evening" className="text-sm">Evening (6PM-12AM)</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Audience Estimate */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Reach</span>
                  <span className="font-medium">4.2M - 5.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retail Media</span>
                  <span className="font-medium">2.1M - 2.9M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precision Score</span>
                  <Badge variant="secondary">High (85%)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Active Segments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedAudiences.length > 0 ? (
                selectedAudiences.map((audience) => (
                  <Badge key={audience} variant="outline" className="mr-2 mb-2">
                    {audience}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No segments selected</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target className="h-4 w-4" />
                Save as Custom Audience
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Create Lookalike
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Clock className="h-4 w-4" />
                Schedule Targeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RetailMedia
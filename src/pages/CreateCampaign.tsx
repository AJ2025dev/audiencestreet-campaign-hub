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
import { 
  ArrowLeft,
  Save,
  Play,
  Target,
  DollarSign,
  Calendar,
  Users,
  Settings
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const CreateCampaign = () => {
  const navigate = useNavigate()
  const [campaignData, setCampaignData] = useState({
    name: "",
    objective: "",
    budget: "",
    dailyBudget: "",
    startDate: "",
    endDate: "",
    targeting: {
      age: { min: 18, max: 65 },
      gender: "all",
      locations: [],
      interests: [],
      behaviors: []
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/campaigns')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Create Campaign</h1>
          <p className="text-muted-foreground">Set up your new advertising campaign</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="gradient" className="gap-2">
            <Play className="h-4 w-4" />
            Launch Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="app-installs">App Installs</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe your campaign goals and strategy"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget & Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget & Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-budget">Total Budget</Label>
                  <Input 
                    id="total-budget"
                    placeholder="$10,000"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-budget">Daily Budget</Label>
                  <Input 
                    id="daily-budget"
                    placeholder="$100"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Budget Pacing</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pacing strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (Even distribution)</SelectItem>
                    <SelectItem value="accelerated">Accelerated (Spend as fast as possible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Targeting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Audience Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demographics */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Demographics</h4>
                
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
                    <Label>Location</Label>
                    <Input placeholder="United States" />
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Interests</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Technology", "Sports", "Fashion", "Travel", "Food", "Fitness"].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox id={interest} />
                      <Label htmlFor={interest} className="text-sm">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behaviors */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Behaviors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Frequent Travelers", "Online Shoppers", "Mobile Users", "Social Media Users", "Video Watchers", "Game Players"].map((behavior) => (
                    <div key={behavior} className="flex items-center space-x-2">
                      <Checkbox id={behavior} />
                      <Label htmlFor={behavior} className="text-sm">{behavior}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Reach</span>
                  <span className="font-medium">2.5M - 3.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Impressions</span>
                  <span className="font-medium">450K - 680K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. CPM</span>
                  <span className="font-medium">$6.50 - $8.20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. CTR</span>
                  <span className="font-medium">1.8% - 2.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-accent rounded-lg">
                💡 <strong>Tip:</strong> Start with a broader audience and narrow down based on performance data.
              </div>
              <div className="p-3 bg-accent rounded-lg">
                📊 <strong>Best Practice:</strong> Set up conversion tracking before launching your campaign.
              </div>
              <div className="p-3 bg-accent rounded-lg">
                🎯 <strong>Targeting:</strong> Use lookalike audiences based on your best customers.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign
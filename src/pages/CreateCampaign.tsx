import { useState, useRef } from "react"
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
  Settings,
  Monitor,
  Smartphone,
  Tv,
  Radio,
  Image,
  Video,
  Layout,
  Youtube,
  Leaf
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  // AI Strategy state
  const [aiPromptData, setAiPromptData] = useState({
    brandDescription: "",
    campaignObjective: "",
    landingPage: ""
  })
  const [generatedStrategy, setGeneratedStrategy] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // File upload refs
  const videoFileRef = useRef<HTMLInputElement>(null)
  const displayFileRef = useRef<HTMLInputElement>(null)
  const bannerFileRef = useRef<HTMLInputElement>(null)

  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState({
    video: [] as File[],
    display: [] as File[],
    banner: [] as File[]
  })

  // DSP & SSP Selection State
  const [selectedDSPs, setSelectedDSPs] = useState<string[]>(["The Trade Desk", "Amazon DSP", "Verizon Media DSP"])
  const [selectedSSPs, setSelectedSSPs] = useState<string[]>(["Google Ad Manager", "Amazon Publisher Services", "PubMatic"])

  const handleDSPToggle = (dspName: string) => {
    setSelectedDSPs(prev => 
      prev.includes(dspName) 
        ? prev.filter(name => name !== dspName)
        : [...prev, dspName]
    )
  }

  const handleSSPToggle = (sspName: string) => {
    setSelectedSSPs(prev => 
      prev.includes(sspName) 
        ? prev.filter(name => name !== sspName)
        : [...prev, sspName]
    )
  }

  const handleFileUpload = (type: 'video' | 'display' | 'banner', files: FileList | null) => {
    if (!files) return
    
    const fileArray = Array.from(files)
    setUploadedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }))
  }

  const removeFile = (type: 'video' | 'display' | 'banner', index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const launchCampaign = () => {
    // Validate required fields
    if (!campaignData.name) {
      alert('Please enter a campaign name')
      return
    }
    
    // Create campaign object
    const campaignPayload = {
      ...campaignData,
      dsps: selectedDSPs,
      ssps: selectedSSPs,
      creatives: uploadedFiles,
      strategy: generatedStrategy,
      createdAt: new Date().toISOString()
    }
    
    console.log('Launching campaign:', campaignPayload)
    alert('Campaign launched successfully! (This is a demo - in production this would connect to your DSP/SSP APIs)')
    
    // Navigate back to campaigns page
    navigate('/campaigns')
  }

  const generateCampaignStrategy = async () => {
    if (!aiPromptData.brandDescription || !aiPromptData.campaignObjective) {
      alert("Please fill in both brand description and campaign objective")
      return
    }

    setIsGenerating(true)
    try {
      // Use the proper Supabase URL format for edge functions
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-campaign-strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify(aiPromptData)
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedStrategy(data.strategy)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate strategy')
      }
    } catch (error) {
      console.error('Error generating strategy:', error)
      alert(`Failed to generate campaign strategy: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

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
          <Button 
            variant="gradient" 
            className="gap-2"
            onClick={launchCampaign}
          >
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-description">Brand/Product Description</Label>
                  <Textarea 
                    id="brand-description"
                    placeholder="Describe your brand, product, or service. Include key features, target market, and unique selling points..."
                    rows={3}
                    value={aiPromptData.brandDescription}
                    onChange={(e) => setAiPromptData(prev => ({ ...prev, brandDescription: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaign-objective-ai">Campaign Objective & Goals</Label>
                  <Textarea 
                    id="campaign-objective-ai"
                    placeholder="What do you want to achieve with this campaign? (e.g., increase brand awareness, drive sales, generate leads, promote new product launch...)"
                    rows={2}
                    value={aiPromptData.campaignObjective}
                    onChange={(e) => setAiPromptData(prev => ({ ...prev, campaignObjective: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landing-page">Landing Page URL (Optional)</Label>
                  <Input 
                    id="landing-page"
                    placeholder="https://example.com/landing-page"
                    value={aiPromptData.landingPage}
                    onChange={(e) => setAiPromptData(prev => ({ ...prev, landingPage: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={generateCampaignStrategy}
                  disabled={isGenerating || !aiPromptData.brandDescription || !aiPromptData.campaignObjective}
                  className="w-full"
                >
                  {isGenerating ? "Generating Strategy..." : "Generate AI Campaign Strategy"}
                </Button>

                {generatedStrategy && (
                  <div className="space-y-2">
                    <Label>Generated Campaign Strategy</Label>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <pre className="whitespace-pre-wrap text-sm">{generatedStrategy}</pre>
                    </div>
                  </div>
                )}
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
            <CardContent>
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General Targeting</TabsTrigger>
                  <TabsTrigger value="youtube">YouTube Targeting</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
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
                </TabsContent>

                <TabsContent value="youtube" className="space-y-6">
                  {/* YouTube Targeting */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube-Specific Targeting
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Video Length</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select video length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (&lt; 4 minutes)</SelectItem>
                            <SelectItem value="medium">Medium (4-20 minutes)</SelectItem>
                            <SelectItem value="long">Long (&gt; 20 minutes)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Content Categories</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Channel Targeting</Label>
                      <Textarea placeholder="Enter specific YouTube channel names or IDs" rows={3} />
                    </div>

                    <div className="space-y-2">
                      <Label>Keyword Targeting</Label>
                      <Input placeholder="Enter keywords for video content targeting" />
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-medium text-foreground">YouTube Ad Formats</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "TrueView In-Stream",
                          "TrueView Discovery", 
                          "Bumper Ads",
                          "Non-Skippable In-Stream",
                          "Video Action Campaigns",
                          "YouTube Shorts"
                        ].map((format) => (
                          <div key={format} className="flex items-center space-x-2">
                            <Checkbox id={format} />
                            <Label htmlFor={format} className="text-sm">{format}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Geo Targeting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Geographic Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country/Region</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select countries" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="all">All Countries</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="it">Italy</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="nl">Netherlands</SelectItem>
                      <SelectItem value="se">Sweden</SelectItem>
                      <SelectItem value="no">Norway</SelectItem>
                      <SelectItem value="dk">Denmark</SelectItem>
                      <SelectItem value="fi">Finland</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                      <SelectItem value="ar">Argentina</SelectItem>
                      <SelectItem value="cl">Chile</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="kr">South Korea</SelectItem>
                      <SelectItem value="cn">China</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="hk">Hong Kong</SelectItem>
                      <SelectItem value="th">Thailand</SelectItem>
                      <SelectItem value="id">Indonesia</SelectItem>
                      <SelectItem value="ph">Philippines</SelectItem>
                      <SelectItem value="my">Malaysia</SelectItem>
                      <SelectItem value="vn">Vietnam</SelectItem>
                      <SelectItem value="za">South Africa</SelectItem>
                      <SelectItem value="eg">Egypt</SelectItem>
                      <SelectItem value="ae">UAE</SelectItem>
                      <SelectItem value="sa">Saudi Arabia</SelectItem>
                      <SelectItem value="ru">Russia</SelectItem>
                      <SelectItem value="pl">Poland</SelectItem>
                      <SelectItem value="cz">Czech Republic</SelectItem>
                      <SelectItem value="hu">Hungary</SelectItem>
                      <SelectItem value="ro">Romania</SelectItem>
                      <SelectItem value="bg">Bulgaria</SelectItem>
                      <SelectItem value="hr">Croatia</SelectItem>
                      <SelectItem value="si">Slovenia</SelectItem>
                      <SelectItem value="sk">Slovakia</SelectItem>
                      <SelectItem value="ee">Estonia</SelectItem>
                      <SelectItem value="lv">Latvia</SelectItem>
                      <SelectItem value="lt">Lithuania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>State/Province</Label>
                  <Input placeholder="Enter states or provinces" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cities</Label>
                  <Input placeholder="Enter cities (comma-separated)" />
                </div>
                
                <div className="space-y-2">
                  <Label>Zip/Postal Codes</Label>
                  <Input placeholder="Enter zip codes" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Radius Targeting</Label>
                <div className="flex items-center gap-2">
                  <Input placeholder="Latitude" />
                  <Input placeholder="Longitude" />
                  <Input placeholder="Radius (miles)" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location Exclusions</Label>
                <Textarea placeholder="Enter locations to exclude from targeting" rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* DSP & SSP Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                DSP & SSP Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Demand Side Platforms (DSP)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "The Trade Desk", type: "Premium DSP" },
                    { name: "Amazon DSP", type: "Retail Media" },
                    { name: "Google DV360", type: "Video & Display" },
                    { name: "Adobe Advertising Cloud", type: "Cross-Channel" },
                    { name: "Verizon Media DSP", type: "Native & Video" },
                    { name: "Samsung DSP", type: "CTV & Mobile" }
                  ].map((dsp) => {
                    const isSelected = selectedDSPs.includes(dsp.name)
                    return (
                      <div 
                        key={dsp.name} 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleDSPToggle(dsp.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-foreground">{dsp.name}</h5>
                            <p className="text-sm text-muted-foreground">{dsp.type}</p>
                          </div>
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => handleDSPToggle(dsp.name)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Supply Side Platforms (SSP)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Google Ad Manager", type: "Premium Inventory" },
                    { name: "PubMatic", type: "Header Bidding" },
                    { name: "Rubicon Project", type: "Real-time Bidding" },
                    { name: "AppNexus/Xandr", type: "Programmatic" },
                    { name: "OpenX", type: "Video & Mobile" },
                    { name: "Index Exchange", type: "Header Bidding" }
                  ].map((ssp) => {
                    const isSelected = selectedSSPs.includes(ssp.name)
                    return (
                      <div 
                        key={ssp.name} 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleSSPToggle(ssp.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-foreground">{ssp.name}</h5>
                            <p className="text-sm text-muted-foreground">{ssp.type}</p>
                          </div>
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => handleSSPToggle(ssp.name)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bidding Strategy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bidding strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpm">CPM (Cost Per Mille)</SelectItem>
                    <SelectItem value="cpc">CPC (Cost Per Click)</SelectItem>
                    <SelectItem value="cpa">CPA (Cost Per Acquisition)</SelectItem>
                    <SelectItem value="vcpm">vCPM (Viewable CPM)</SelectItem>
                    <SelectItem value="dynamic">Dynamic Bidding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* DMP Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Data Management Platform (DMP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">First-Party Data Sources</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "CRM Database",
                    "Website Analytics", 
                    "Email Subscribers",
                    "Mobile App Users",
                    "Purchase History",
                    "Customer Support Data"
                  ].map((source) => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox id={source} />
                      <Label htmlFor={source} className="text-sm">{source}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Third-Party Data Providers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Acxiom", type: "Demographics & Lifestyle", cost: "$2.50 CPM" },
                    { name: "Experian", type: "Financial & Credit", cost: "$3.00 CPM" },
                    { name: "Epsilon", type: "Purchase Intent", cost: "$4.25 CPM" },
                    { name: "LiveRamp", type: "Identity Resolution", cost: "$1.75 CPM" },
                    { name: "Neustar", type: "Location & Mobile", cost: "$2.80 CPM" },
                    { name: "Lotame", type: "Behavioral Segments", cost: "$3.50 CPM" }
                  ].map((provider) => (
                    <div key={provider.name} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-foreground text-sm">{provider.name}</h5>
                        <Checkbox />
                      </div>
                      <p className="text-xs text-muted-foreground">{provider.type}</p>
                      <p className="text-xs text-primary font-medium">{provider.cost}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Audience Segments</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    "High-Value Customers",
                    "Frequent Purchasers",
                    "Cart Abandoners", 
                    "Lookalike Audiences",
                    "Competitor Audiences",
                    "Interest-Based Segments",
                    "Behavioral Cohorts",
                    "Geographic Clusters",
                    "Device Preferences"
                  ].map((segment) => (
                    <div key={segment} className="flex items-center space-x-2">
                      <Checkbox id={segment} />
                      <Label htmlFor={segment} className="text-sm">{segment}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Refresh Rate</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select refresh rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Attribution Window</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribution window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1day">1 Day</SelectItem>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="14days">14 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Environment Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "CTV/OTT", icon: Tv, desc: "Connected TV & Over-the-Top" },
                  { name: "In-App", icon: Smartphone, desc: "Mobile Applications" },
                  { name: "Web", icon: Monitor, desc: "Desktop & Mobile Web" },
                  { name: "PdOOH", icon: Radio, desc: "Programmatic Digital Out-of-Home" }
                ].map((env) => (
                  <div key={env.name} className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <env.icon className="h-8 w-8 text-primary" />
                      <h5 className="font-medium text-foreground">{env.name}</h5>
                      <p className="text-xs text-muted-foreground">{env.desc}</p>
                      <Checkbox />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creative Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Creative Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Creatives
                </h4>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Upload video files (MP4, MOV, AVI)</p>
                    <input
                      ref={videoFileRef}
                      type="file"
                      accept=".mp4,.mov,.avi"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload('video', e.target.files)}
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => videoFileRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  {uploadedFiles.video.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Videos:</Label>
                      {uploadedFiles.video.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFile('video', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Video Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6s">6 seconds (Bumper)</SelectItem>
                          <SelectItem value="15s">15 seconds</SelectItem>
                          <SelectItem value="30s">30 seconds</SelectItem>
                          <SelectItem value="60s">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Aspect Ratio</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                          <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                          <SelectItem value="1:1">1:1 (Square)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Display Creatives
                </h4>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Upload display ads (JPG, PNG, GIF)</p>
                    <input
                      ref={displayFileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload('display', e.target.files)}
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => displayFileRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  {uploadedFiles.display.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Display Ads:</Label>
                      {uploadedFiles.display.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFile('display', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "300x250 (Medium Rectangle)",
                      "728x90 (Leaderboard)", 
                      "320x50 (Mobile Banner)",
                      "160x600 (Wide Skyscraper)",
                      "970x250 (Billboard)",
                      "300x600 (Half Page)"
                    ].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox id={size} />
                        <Label htmlFor={size} className="text-xs">{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Banner Creatives
                </h4>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Layout className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Upload banner ads (HTML5, JPG, PNG)</p>
                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept=".html,.jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload('banner', e.target.files)}
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => bannerFileRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  {uploadedFiles.banner.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Banner Ads:</Label>
                      {uploadedFiles.banner.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFile('banner', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Animation Settings</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="autoplay" />
                        <Label htmlFor="autoplay" className="text-sm">Auto-play animation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="loop" />
                        <Label htmlFor="loop" className="text-sm">Loop animation</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbon Footprint */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Carbon Footprint Measurement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Sustainability Tracking</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Monitor and reduce the environmental impact of your digital advertising campaigns.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="carbon-tracking" defaultChecked />
                  <Label htmlFor="carbon-tracking" className="text-sm">Enable carbon footprint tracking</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Carbon Offset Budget</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offset amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No offset</SelectItem>
                        <SelectItem value="partial">Partial offset (50%)</SelectItem>
                        <SelectItem value="full">Full offset (100%)</SelectItem>
                        <SelectItem value="positive">Carbon positive (120%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Green Media Preference</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard inventory</SelectItem>
                        <SelectItem value="preferred">Prefer green inventory</SelectItem>
                        <SelectItem value="exclusive">Green inventory only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-foreground">Sustainability Metrics</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-muted-foreground">Est. CO₂ Emissions</p>
                      <p className="font-medium">2.4 kg CO₂</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-muted-foreground">Offset Cost</p>
                      <p className="font-medium">$0.12</p>
                    </div>
                  </div>
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
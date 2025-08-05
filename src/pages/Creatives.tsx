import { useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
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
import { 
  ArrowLeft,
  Save,
  Image,
  Video,
  Layout,
  Sparkles,
  Globe,
  FileText,
  Code,
  Newspaper,
  Play
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Creatives = () => {
  const navigate = useNavigate()
  
  // File upload refs
  const videoFileRef = useRef<HTMLInputElement>(null)
  const displayFileRef = useRef<HTMLInputElement>(null)
  const bannerFileRef = useRef<HTMLInputElement>(null)
  const htmlFileRef = useRef<HTMLInputElement>(null)
  const nativeFileRef = useRef<HTMLInputElement>(null)

  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState({
    video: [] as File[],
    display: [] as File[],
    banner: [] as File[],
    html: [] as File[],
    native: [] as File[]
  })

  // Additional states for HTML/VAST tags
  const [htmlTagInputs, setHtmlTagInputs] = useState({
    htmlTag: "",
    jsTag: "",
    vastTag: ""
  })

  // AI Generation states
  const [aiData, setAiData] = useState({
    siteUrl: "",
    creativeBrief: ""
  })
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([])
  const [selectedCreativeTypes, setSelectedCreativeTypes] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCreatives, setGeneratedCreatives] = useState<any[]>([])
  const { toast } = useToast()

  const handleFileUpload = (type: 'video' | 'display' | 'banner' | 'html' | 'native', files: FileList | null) => {
    if (!files) return
    
    const fileArray = Array.from(files)
    setUploadedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }))
  }

  const removeFile = (type: 'video' | 'display' | 'banner' | 'html' | 'native', index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const generateCreatives = async () => {
    if (!aiData.siteUrl && !aiData.creativeBrief) {
      toast({
        title: "Missing Information",
        description: "Please provide either a website URL or creative brief to generate creatives.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    console.log('Starting creative generation with data:', {
      websiteUrl: aiData.siteUrl,
      creativeBrief: aiData.creativeBrief,
      environments: selectedEnvironments,
      creativeTypes: selectedCreativeTypes
    });
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-creatives', {
        body: {
          websiteUrl: aiData.siteUrl,
          creativeBrief: aiData.creativeBrief,
          environments: selectedEnvironments,
          creativeTypes: selectedCreativeTypes
        }
      });

      console.log('Supabase function response:', { data, error });
      if (error) throw error;

      if (data.success) {
        setGeneratedCreatives(data.creatives);
        toast({
          title: "Success!",
          description: `Generated ${data.creatives?.length || 0} creative assets`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error generating creatives:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate creatives. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  // Download functionality
  const downloadImage = (imageDataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageDataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadVideoKeyframes = (keyframes: any[], creativeName: string) => {
    keyframes.forEach((keyframe, index) => {
      downloadImage(keyframe.image, `${creativeName}_keyframe_${index + 1}.png`)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-elegant">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/campaigns')}
            className="hover:bg-accent/50 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Creative Assets
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Upload existing creatives or generate new ones with AI</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="gradient" className="gap-2 shadow-lg">
              <Save className="h-4 w-4" />
              Save Creatives
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="ai-generation" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm p-1">
                <TabsTrigger value="ai-generation" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  AI Generation
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  Upload Existing
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="ai-generation" className="space-y-8">
                {/* AI Creative Generation */}
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary-glow/5">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      AI Creative Generation
                    </CardTitle>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-url" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website URL
                    </Label>
                    <Input 
                      id="site-url"
                      placeholder="https://example.com"
                      value={aiData.siteUrl}
                      onChange={(e) => setAiData(prev => ({ ...prev, siteUrl: e.target.value }))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Our AI will analyze your website to extract brand colors, fonts, and style elements
                    </p>
                  </div>
                  
                  <div className="text-center text-muted-foreground">or</div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="creative-brief" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Creative Brief
                    </Label>
                    <Textarea 
                      id="creative-brief"
                      placeholder="Describe your creative requirements: brand colors, style preferences, messaging, target audience, specific elements to include..."
                      rows={4}
                      value={aiData.creativeBrief}
                      onChange={(e) => setAiData(prev => ({ ...prev, creativeBrief: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Target Environments</Label>
                       <div className="space-y-2">
                         {["CTV/OTT", "Web Display", "Mobile In-App", "Social Media", "Digital Billboards"].map((env) => (
                           <div key={env} className="flex items-center space-x-2">
                             <input 
                               type="checkbox" 
                               id={env} 
                               checked={selectedEnvironments.includes(env)}
                               onChange={(e) => {
                                 if (e.target.checked) {
                                   setSelectedEnvironments([...selectedEnvironments, env]);
                                 } else {
                                   setSelectedEnvironments(selectedEnvironments.filter(e => e !== env));
                                 }
                               }}
                             />
                             <Label htmlFor={env} className="text-sm">{env}</Label>
                           </div>
                         ))}
                       </div>
                     </div>
                    
                     <div className="space-y-2">
                       <Label>Creative Types</Label>
                       <div className="space-y-2">
                         {["Video Ads (15s, 30s)", "Display Banners", "Native Ads", "Rich Media", "Interactive Ads"].map((type) => (
                           <div key={type} className="flex items-center space-x-2">
                             <input 
                               type="checkbox" 
                               id={type} 
                               checked={selectedCreativeTypes.includes(type)}
                               onChange={(e) => {
                                 if (e.target.checked) {
                                   setSelectedCreativeTypes([...selectedCreativeTypes, type]);
                                 } else {
                                   setSelectedCreativeTypes(selectedCreativeTypes.filter(t => t !== type));
                                 }
                               }}
                             />
                             <Label htmlFor={type} className="text-sm">{type}</Label>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>

                  <Button 
                    onClick={generateCreatives}
                    disabled={isGenerating || (!aiData.siteUrl && !aiData.creativeBrief) || selectedCreativeTypes.length === 0}
                    className="w-full"
                    variant="gradient"
                  >
                    {isGenerating ? "Generating Creatives..." : "Generate AI Creatives"}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Creatives Display */}
              {generatedCreatives.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Creatives</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {generatedCreatives.map((creative, index) => (
                         <div key={index} className="border rounded-lg p-4 space-y-2">
                           {creative.type === 'banner' && (
                             <>
                               <div className="flex justify-between items-center">
                                 <h4 className="font-medium">{creative.size} Banner</h4>
                                 <span className="text-sm text-muted-foreground">{creative.dimensions}</span>
                               </div>
                               <img 
                                 src={creative.image} 
                                 alt={`Generated ${creative.size} banner`}
                                 className="w-full h-auto rounded border"
                               />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => downloadImage(creative.image, `${creative.size}_banner.png`)}
                                  >
                                    Download
                                  </Button>
                                 <Button size="sm" variant="outline" className="flex-1">
                                   Assign to Campaign
                                 </Button>
                               </div>
                             </>
                            )}
                             {creative.type === 'video' && (
                               <>
                                 <div className="flex justify-between items-center">
                                   <h4 className="font-medium">Video Concept</h4>
                                   <span className="text-sm text-muted-foreground">{creative.duration}</span>
                                 </div>
                                 {creative.keyframes && creative.keyframes.length > 0 ? (
                                   <div className="space-y-3">
                                     <p className="text-sm text-muted-foreground">Video Keyframes:</p>
                                     <div className="grid grid-cols-2 gap-2">
                                       {creative.keyframes.map((keyframe: any, kIndex: number) => (
                                         <div key={kIndex} className="space-y-1">
                                           <img 
                                             src={keyframe.image} 
                                             alt={`Keyframe ${keyframe.scene}`}
                                             className="w-full h-auto rounded border aspect-video object-cover"
                                           />
                                           <p className="text-xs text-muted-foreground">
                                             Scene {keyframe.scene} ({keyframe.timestamp})
                                           </p>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                     {creative.concept || creative.storyboard}
                                   </div>
                                 )}
                                 <div className="flex gap-2 mt-3">
                                   <Button 
                                     size="sm" 
                                     variant="outline" 
                                     className="flex-1"
                                     onClick={() => downloadVideoKeyframes(creative.keyframes, 'video_ad')}
                                   >
                                     Download Video Keyframes
                                   </Button>
                                   <Button size="sm" variant="outline" className="flex-1">
                                     Assign to Campaign
                                   </Button>
                                 </div>
                               </>
                             )}
                            {creative.type === 'rich-media' && (
                              <>
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Rich Media</h4>
                                  <span className="text-sm text-muted-foreground">{creative.format}</span>
                                </div>
                                <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                  {creative.description}
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Download Concept
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Assign to Campaign
                                  </Button>
                                </div>
                              </>
                            )}
                            {creative.type === 'native' && (
                              <>
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Native Ad</h4>
                                  <span className="text-sm text-muted-foreground">{creative.format}</span>
                                </div>
                                <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                  {creative.description}
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Download Concept
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Assign to Campaign
                                  </Button>
                                </div>
                              </>
                            )}
                            {creative.type === 'interactive' && (
                              <>
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Interactive Ad</h4>
                                  <span className="text-sm text-muted-foreground">{creative.format}</span>
                                </div>
                                <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                  {creative.description}
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Download Concept
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Assign to Campaign
                                  </Button>
                                </div>
                              </>
                            )}
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

              <TabsContent value="upload" className="space-y-8">
                {/* Video Creatives */}
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary-glow/5">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      Video Creatives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center bg-primary/5">
                      <Play className="h-10 w-10 text-primary/60 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">Upload video files (MP4, MOV, AVI)</p>
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
                        className="hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => videoFileRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                    {uploadedFiles.video.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Uploaded Videos:</Label>
                        <div className="space-y-2">
                          {uploadedFiles.video.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                              <span className="text-sm font-medium">{file.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeFile('video', index)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Video Duration</Label>
                        <Select>
                          <SelectTrigger className="bg-muted/30">
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
                        <Label className="text-base font-medium">Aspect Ratio</Label>
                        <Select>
                          <SelectTrigger className="bg-muted/30">
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
                </CardContent>
              </Card>

                {/* Display Creatives */}
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-warning/5 to-warning/10">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <Layout className="h-6 w-6 text-warning" />
                      </div>
                      Display Creatives
                    </CardTitle>
                  </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Banner Creatives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Banner Creatives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Layout className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Upload banner ads (JPG, PNG, GIF)</p>
                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
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
                      <Label>Uploaded Banners:</Label>
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "728x90 (Leaderboard)",
                      "300x250 (Medium Rectangle)", 
                      "320x50 (Mobile Banner)",
                      "160x600 (Wide Skyscraper)",
                      "300x600 (Half Page)",
                      "970x250 (Billboard)"
                    ].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <input type="checkbox" id={size} />
                        <Label htmlFor={size} className="text-xs">{size}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* HTML/JS/VAST Tag Creatives */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-warning/5 to-warning/10">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Code className="h-6 w-6 text-warning" />
                    </div>
                    HTML/JS/VAST Tag Creatives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="html-tag" className="text-base font-medium">HTML Tag</Label>
                      <Textarea 
                        id="html-tag"
                        placeholder="Paste your HTML creative tag here..."
                        rows={4}
                        value={htmlTagInputs.htmlTag}
                        onChange={(e) => setHtmlTagInputs(prev => ({ ...prev, htmlTag: e.target.value }))}
                        className="font-mono text-sm bg-muted/30"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="js-tag" className="text-base font-medium">JavaScript Tag</Label>
                      <Textarea 
                        id="js-tag"
                        placeholder="Paste your JavaScript creative tag here..."
                        rows={4}
                        value={htmlTagInputs.jsTag}
                        onChange={(e) => setHtmlTagInputs(prev => ({ ...prev, jsTag: e.target.value }))}
                        className="font-mono text-sm bg-muted/30"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="vast-tag" className="text-base font-medium">VAST Tag URL</Label>
                      <Input 
                        id="vast-tag"
                        placeholder="https://example.com/vast-tag-url"
                        value={htmlTagInputs.vastTag}
                        onChange={(e) => setHtmlTagInputs(prev => ({ ...prev, vastTag: e.target.value }))}
                        className="font-mono text-sm bg-muted/30"
                      />
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center bg-primary/5">
                    <Code className="h-10 w-10 text-primary/60 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Upload HTML/JS files (HTML, JS)</p>
                    <input
                      ref={htmlFileRef}
                      type="file"
                      accept=".html,.js,.htm"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload('html', e.target.files)}
                    />
                    <Button 
                      variant="outline" 
                      className="hover:bg-primary/5 hover:border-primary/30"
                      onClick={() => htmlFileRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  
                  {uploadedFiles.html.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Uploaded HTML/JS Files:</Label>
                      <div className="space-y-2">
                        {uploadedFiles.html.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                            <span className="text-sm font-medium">{file.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFile('html', index)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Native Creatives */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-success/5 to-success/10">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Newspaper className="h-6 w-6 text-success" />
                    </div>
                    Native Creatives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="border-2 border-dashed border-success/20 rounded-xl p-8 text-center bg-success/5">
                    <Newspaper className="h-10 w-10 text-success/60 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Upload native ad content (JSON, XML, Images)</p>
                    <input
                      ref={nativeFileRef}
                      type="file"
                      accept=".json,.xml,.jpg,.jpeg,.png,.gif"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload('native', e.target.files)}
                    />
                    <Button 
                      variant="outline" 
                      className="hover:bg-success/5 hover:border-success/30"
                      onClick={() => nativeFileRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  
                  {uploadedFiles.native.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Uploaded Native Files:</Label>
                      <div className="space-y-2">
                        {uploadedFiles.native.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                            <span className="text-sm font-medium">{file.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFile('native', index)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Native Ad Type</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-feed">In-Feed</SelectItem>
                          <SelectItem value="content-recommendation">Content Recommendation</SelectItem>
                          <SelectItem value="search">Search</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Content Format</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="app-install">App Install</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creative Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Video Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Max file size: 100MB</li>
                  <li>• Formats: MP4, MOV, AVI</li>
                  <li>• Resolution: 1080p minimum</li>
                  <li>• Duration: 6s-60s</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Display Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Max file size: 5MB</li>
                  <li>• Formats: JPG, PNG, GIF</li>
                  <li>• Resolution: High-DPI ready</li>
                  <li>• Animation: Under 30s loop</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Generation Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Provide your website URL for automatic brand extraction</p>
                <p>• Include specific messaging and call-to-action requirements</p>
                <p>• Mention your target audience and tone of voice</p>
                <p>• Specify any brand guidelines or restrictions</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Creatives
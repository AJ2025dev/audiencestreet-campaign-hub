import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API client configurations
interface APIConfig {
  name: string;
  costPerImage: number;
  maxImagesPerBatch: number;
  supportsVideo: boolean;
  quality: 'high' | 'medium' | 'low';
}

const API_CONFIGS: Record<string, APIConfig> = {
  openai: { name: 'OpenAI', costPerImage: 0.04, maxImagesPerBatch: 10, supportsVideo: false, quality: 'high' },
  replicate: { name: 'Replicate', costPerImage: 0.008, maxImagesPerBatch: 50, supportsVideo: true, quality: 'medium' },
};

// Smart API routing logic
function selectOptimalAPI(requestCount: number, budget: number = 100, quality: 'high' | 'medium' | 'low' = 'medium'): string {
  if (quality === 'high' || requestCount <= 5) return 'openai';
  if (requestCount > 20 && budget < 50) return 'replicate';
  return requestCount > 10 ? 'replicate' : 'openai';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl, creativeBrief, environments, creativeTypes } = await req.json();
    
    console.log('Received request:', { websiteUrl, creativeBrief, environments, creativeTypes });
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const replicateApiKey = Deno.env.get('REPLICATE_API_KEY');
    
    console.log('API Keys available:', { 
      openAI: !!openAIApiKey, 
      replicate: !!replicateApiKey 
    });
    
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    // Initialize Replicate if available
    const replicate = replicateApiKey ? new Replicate({ auth: replicateApiKey }) : null;
    const creatives = [];
    
    // Determine optimal API strategy
    const estimatedImages = (creativeTypes?.includes('Display Banners') ? 4 : 0) + 
                           (creativeTypes?.includes('Video Ads (15s, 30s)') ? 4 : 0);
    const selectedAPI = selectOptimalAPI(estimatedImages);
    console.log(`Selected API strategy: ${selectedAPI} for ${estimatedImages} images`);

    // Analyze website if URL provided
    let brandInfo = '';
    let websiteContent = '';
    if (websiteUrl) {
      try {
        console.log('Analyzing website:', websiteUrl);
        
        // Add headers to appear like a real browser
        const websiteResponse = await fetch(websiteUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
          }
        });
        
        if (!websiteResponse.ok) {
          throw new Error(`HTTP ${websiteResponse.status}: ${websiteResponse.statusText}`);
        }
        
        const html = await websiteResponse.text();
        console.log('HTML content length:', html.length);
        
        // Extract comprehensive brand info
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);
        
        // Extract Open Graph data
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
        
        // Extract text content for analysis
        let textContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<header[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Take first 3000 characters for analysis
        websiteContent = textContent.substring(0, 3000);
        
        const title = titleMatch?.[1] || ogTitleMatch?.[1] || 'Unknown';
        const description = descMatch?.[1] || ogDescMatch?.[1] || 'No description available';
        const keywords = keywordsMatch?.[1] || 'Not specified';
        
        brandInfo = `Company: ${title}
Description: ${description}
Keywords: ${keywords}
Website Content: ${websiteContent.substring(0, 800)}`;
        
        console.log('Successfully extracted brand info:');
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Content preview:', websiteContent.substring(0, 200));
        
      } catch (e) {
        console.error('Website analysis failed:', e);
        brandInfo = `Website analysis failed for ${websiteUrl}: ${e.message}`;
      }
    }

    // Generate creative concepts using OpenAI
    const conceptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert creative director with 15+ years experience creating award-winning digital advertising campaigns. You understand brand psychology, visual design principles, consumer behavior, and conversion optimization.`
          },
          {
            role: 'user',
            content: `You are a creative director specializing in data-driven advertising campaigns. Analyze the provided brand information and create highly targeted creative concepts that directly reflect the brand's actual offerings, style, and target audience.

BRAND ANALYSIS:
Website URL: ${websiteUrl || 'Not provided'}
${brandInfo ? `BRAND DETAILS:\n${brandInfo}\n` : ''}
${websiteContent ? `WEBSITE CONTENT ANALYSIS:\n${websiteContent.substring(0, 1000)}\n` : ''}
Creative Brief: ${creativeBrief || 'Use brand analysis to inform creative direction'}
Target Environments: ${environments?.join(', ') || 'All platforms'}
Creative Types: ${creativeTypes?.join(', ') || 'All formats'}

INSTRUCTIONS:
1. Base ALL creative concepts on the actual brand information extracted above
2. Use specific products, services, or brand elements mentioned in the website content
3. Match the brand's tone, style, and target demographic
4. Create headlines that reflect what the brand actually offers
5. Design visuals that align with the brand's existing aesthetic

Create 3 distinct creative concepts in this JSON format:
{
  "concept1": {
    "headline": "Brand-specific compelling headline reflecting actual offerings",
    "subtext": "Benefit-focused text using brand's actual value propositions",
    "cta": "Action-oriented CTA matching brand style",
    "visualPrompt": "Detailed visual description incorporating brand colors, style, products, and aesthetic from website analysis",
    "strategy": "Why this concept works for this specific brand"
  },
  "concept2": {...},
  "concept3": {...}
}

CRITICAL: Do NOT use generic business language. Use specific details from the brand analysis to create relevant, targeted content that matches what this brand actually does and sells.`
          }
        ],
      }),
    });

    const conceptData = await conceptResponse.json();
    console.log('OpenAI concept response:', conceptData);
    
    if (!conceptData.choices || !conceptData.choices[0]) {
      throw new Error('Invalid response from OpenAI: ' + JSON.stringify(conceptData));
    }
    
    const conceptsText = conceptData.choices[0].message.content;
    console.log('Raw concepts text:', conceptsText);
    
    // Parse the JSON response
    let concepts;
    try {
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = conceptsText.match(/```json\s*([\s\S]*?)\s*```/) || conceptsText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : conceptsText;
      concepts = JSON.parse(jsonString);
      console.log('Successfully parsed concepts:', concepts);
    } catch (e) {
      console.error('JSON parsing failed:', e);
      console.error('Raw response text:', conceptsText);
      
      // If we have brand info, try to create more relevant fallback
      const fallbackHeadline = brandInfo.includes('Company:') 
        ? brandInfo.split('Company:')[1].split('\n')[0].trim() + ' Solutions'
        : "Transform Your Business";
      
      const fallbackSubtext = brandInfo.includes('Description:')
        ? brandInfo.split('Description:')[1].split('\n')[0].trim().substring(0, 80) + '...'
        : "Innovative solutions that drive growth and success";
      
      concepts = {
        concept1: {
          headline: fallbackHeadline,
          subtext: fallbackSubtext,
          cta: "Get Started",
          visualPrompt: brandInfo ? `Professional imagery reflecting: ${brandInfo.substring(0, 200)}` : "Professional business imagery with modern technology elements",
          strategy: "Based on extracted brand information"
        }
      };
      console.log('Using fallback concepts:', concepts);
    }

    // Generate banners only if Display Banners is selected
    const shouldGenerateBanners = creativeTypes?.includes('Display Banners');
    
    console.log('Should generate banners:', shouldGenerateBanners);
    
    if (shouldGenerateBanners) {
      console.log('Starting banner generation...');
      const bannerSizes = [
        { width: 728, height: 90, name: 'leaderboard' },
        { width: 300, height: 250, name: 'medium-rectangle' },
        { width: 320, height: 50, name: 'mobile-banner' },
        { width: 300, height: 600, name: 'skyscraper' }
      ];

      const conceptKeys = Object.keys(concepts);
      
      for (let i = 0; i < bannerSizes.length; i++) {
        const size = bannerSizes[i];
        const conceptKey = conceptKeys[i % conceptKeys.length];
        const concept = concepts[conceptKey];
        
        console.log(`Generating ${size.name} banner with concept:`, concept);
        
        try {
          const detailedPrompt = `Professional advertising banner design: ${concept.visualPrompt}. Include headline "${concept.headline}" and call-to-action "${concept.cta}". Modern typography, ${size.width}x${size.height} dimensions, advertising layout, marketing design, brand-focused, high-resolution, professional quality.`;
          
          let imageBase64 = null;
          let apiUsed = 'unknown';
          
          // Use selected API for image generation
          if (selectedAPI === 'openai') {
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'dall-e-3',
                prompt: detailedPrompt,
                n: 1,
                size: '1024x1024',
                response_format: 'b64_json',
                quality: 'hd'
              }),
            });

            const imageData = await imageResponse.json();
            console.log(`OpenAI generation response for ${size.name}:`, imageData);
            
            if (imageData.data && imageData.data[0] && imageData.data[0].b64_json) {
              imageBase64 = imageData.data[0].b64_json;
              apiUsed = 'OpenAI DALL-E-3';
            }
          } else if (selectedAPI === 'replicate' && replicate) {
            const output = await replicate.run("black-forest-labs/flux-schnell", {
              input: {
                prompt: detailedPrompt,
                go_fast: true,
                megapixels: "1",
                num_outputs: 1,
                aspect_ratio: "1:1",
                output_format: "webp",
                output_quality: 80,
                num_inference_steps: 4
              }
            });
            
            console.log(`Replicate generation response for ${size.name}:`, output);
            
            if (output && output[0]) {
              // Download and convert to base64
              const imgResponse = await fetch(output[0]);
              const imgArrayBuffer = await imgResponse.arrayBuffer();
              imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imgArrayBuffer)));
              apiUsed = 'Replicate FLUX-Schnell';
            }
          }
          
          if (imageBase64) {
            creatives.push({
              type: 'banner',
              size: size.name,
              dimensions: `${size.width}x${size.height}`,
              image: `data:image/png;base64,${imageBase64}`,
              headline: concept.headline,
              subtext: concept.subtext,
              cta: concept.cta,
              concept: concept.strategy,
              generatedBy: apiUsed,
              cost: API_CONFIGS[selectedAPI]?.costPerImage || 0
            });
            console.log(`Successfully generated ${size.name} banner using ${apiUsed}`);
          } else {
            console.log(`Failed to generate ${size.name} banner - no image data`);
          }
        } catch (error) {
          console.error(`Error generating ${size.name} banner:`, error);
        }
      }
    }

    // Generate video concepts with actual visual keyframes - only if Video Ads is selected
    const shouldGenerateVideo = creativeTypes?.includes('Video Ads (15s, 30s)');
    
    console.log('Should generate video:', shouldGenerateVideo);
    
    if (shouldGenerateVideo) {
      console.log('Starting video keyframe generation...');
      try {
        const firstConcept = concepts[Object.keys(concepts)[0]];
        
        // Generate 4 keyframes for a 30-second video with detailed storytelling
        const keyframeScenes = [
          {
            time: '0-7s',
            description: 'Hook & Problem',
            prompt: `Opening video frame: ${firstConcept.visualPrompt}. Scene shows the problem or captures attention. Professional video production quality, 16:9 cinematic composition, engaging opening shot, advertising style.`
          },
          {
            time: '8-15s', 
            description: 'Solution Introduction',
            prompt: `Product/service introduction: ${creativeBrief}. Shows the solution in action, ${brandInfo}. Professional product showcase, modern presentation, high-quality video frame, 16:9 format, marketing video style.`
          },
          {
            time: '16-23s',
            description: 'Benefits & Proof',
            prompt: `Benefits demonstration: ${firstConcept.subtext}. Visual proof of value, customer satisfaction, results-focused imagery. Professional video quality, testimonial-style scene, 16:9 composition.`
          },
          {
            time: '24-30s',
            description: 'Call to Action',
            prompt: `Strong closing frame: "${firstConcept.headline}" with prominent "${firstConcept.cta}" button. Professional call-to-action scene, conversion-focused design, urgency and excitement, 16:9 video format.`
          }
        ];

        const keyframes = [];
        for (let i = 0; i < keyframeScenes.length; i++) {
          try {
            const scene = keyframeScenes[i];
            let imageBase64 = null;
            let apiUsed = 'unknown';
            
            // Use optimal API for video keyframes (prefer high quality)
            if (selectedAPI === 'openai' || !replicate) {
              console.log(`Generating keyframe ${i + 1} with OpenAI...`);
              
              try {
                const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${openAIApiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: scene.prompt,
                    n: 1,
                    size: '1792x1024', // 16:9 aspect ratio for DALL-E-3
                    response_format: 'b64_json',
                    quality: 'hd'
                  }),
                });

                const imageData = await imageResponse.json();
                console.log(`OpenAI keyframe ${i + 1} response:`, imageData);
                
                if (imageData.data && imageData.data[0] && imageData.data[0].b64_json) {
                  imageBase64 = imageData.data[0].b64_json;
                  apiUsed = 'OpenAI DALL-E-3';
                  console.log(`Successfully generated keyframe ${i + 1} with OpenAI`);
                } else if (imageData.error) {
                  console.error(`OpenAI API error for keyframe ${i + 1}:`, imageData.error);
                  throw new Error(`OpenAI API error: ${imageData.error.message}`);
                } else {
                  console.error(`Failed to get base64 data for keyframe ${i + 1}:`, imageData);
                  throw new Error('No image data received from OpenAI');
                }
              } catch (openAIError) {
                console.error(`OpenAI failed for keyframe ${i + 1}, falling back to Replicate:`, openAIError);
                // Fall back to Replicate if OpenAI fails
                if (replicate) {
                  console.log(`Falling back to Replicate for keyframe ${i + 1}...`);
                  try {
                    const output = await replicate.run("black-forest-labs/flux-schnell", {
                      input: {
                        prompt: scene.prompt,
                        go_fast: true,
                        megapixels: "1.5",
                        num_outputs: 1,
                        aspect_ratio: "16:9",
                        output_format: "webp",
                        output_quality: 90,
                        num_inference_steps: 6
                      }
                    });
                    
                    console.log(`Replicate fallback keyframe ${i + 1} response:`, output);
                    
                    if (output && output[0]) {
                      const imgResponse = await fetch(output[0]);
                      const imgArrayBuffer = await imgResponse.arrayBuffer();
                      imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imgArrayBuffer)));
                      apiUsed = 'Replicate FLUX-Schnell (Fallback)';
                      console.log(`Successfully generated keyframe ${i + 1} with Replicate fallback`);
                    }
                  } catch (replicateError) {
                    console.error(`Replicate fallback also failed for keyframe ${i + 1}:`, replicateError);
                  }
                }
              }
            } else if (replicate) {
              console.log(`Generating keyframe ${i + 1} with Replicate...`);
              const output = await replicate.run("black-forest-labs/flux-schnell", {
                input: {
                  prompt: scene.prompt,
                  go_fast: true,
                  megapixels: "1.5",
                  num_outputs: 1,
                  aspect_ratio: "16:9",
                  output_format: "webp",
                  output_quality: 90,
                  num_inference_steps: 6
                }
              });
              
              console.log(`Replicate keyframe ${i + 1} response:`, output);
              
              if (output && output[0]) {
                try {
                  const imgResponse = await fetch(output[0]);
                  const imgArrayBuffer = await imgResponse.arrayBuffer();
                  imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imgArrayBuffer)));
                  apiUsed = 'Replicate FLUX-Schnell';
                  console.log(`Successfully generated keyframe ${i + 1} with Replicate`);
                } catch (fetchError) {
                  console.error(`Error fetching Replicate image for keyframe ${i + 1}:`, fetchError);
                }
              } else {
                console.error(`No output received from Replicate for keyframe ${i + 1}`);
              }
            }
            
            if (imageBase64) {
              keyframes.push({
                scene: i + 1,
                timestamp: scene.time,
                image: `data:image/png;base64,${imageBase64}`,
                description: scene.description,
                script: scene.prompt,
                generatedBy: apiUsed,
                cost: API_CONFIGS[selectedAPI]?.costPerImage || 0
              });
            }
          } catch (error) {
            console.error(`Error generating keyframe ${i + 1}:`, error);
          }
        }

        if (keyframes.length > 0) {
          const totalVideoCost = keyframes.reduce((sum, frame) => sum + (frame.cost || 0), 0);
          creatives.push({
            type: 'video',
            duration: '30s',
            keyframes,
            headline: firstConcept.headline,
            concept: firstConcept.strategy,
            format: '16:9 Video (1536x1024)',
            totalCost: totalVideoCost,
            keyframeCount: keyframes.length
          });
        }
      } catch (error) {
        console.error('Error generating video keyframes:', error);
      }
    }

    // Generate Rich Media concepts only if selected
    const shouldGenerateRichMedia = creativeTypes?.includes('Rich Media');
    const shouldGenerateNative = creativeTypes?.includes('Native Ads');
    const shouldGenerateInteractive = creativeTypes?.includes('Interactive Ads');
    
    if (shouldGenerateRichMedia || shouldGenerateNative || shouldGenerateInteractive) {
      const richMediaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Create detailed rich media and interactive ad concepts.'
            },
            {
              role: 'user',
              content: `Create rich media and interactive ad concepts for:
              Brief: ${creativeBrief}
              Brand: ${brandInfo}
              
              Include concepts for:
              - Rich Media expandable banners
              - Interactive video overlays
              - Native ad formats
              - Carousel/gallery ads`
            }
          ],
        }),
      });

      const richMediaData = await richMediaResponse.json();
      
      if (shouldGenerateRichMedia) {
        creatives.push({
          type: 'rich-media',
          format: 'Expandable Banner',
          concept: richMediaData.choices[0].message.content.split('\n')[0],
          description: richMediaData.choices[0].message.content
        });
      }

      if (shouldGenerateNative) {
        creatives.push({
          type: 'native',
          format: 'Native Article',
          concept: 'Native advertising concept',
          description: richMediaData.choices[0].message.content.split('\n').slice(1).join('\n')
        });
      }

      if (shouldGenerateInteractive) {
        creatives.push({
          type: 'interactive',
          format: 'Interactive Video Overlay',
          concept: 'Interactive advertising concept',
          description: richMediaData.choices[0].message.content
        });
      }
    }

    // Calculate total cost and API usage stats
    const totalCost = creatives.reduce((sum, creative) => {
      if (creative.cost) return sum + creative.cost;
      if (creative.totalCost) return sum + creative.totalCost;
      return sum;
    }, 0);
    
    const apiUsageStats = creatives.reduce((stats, creative) => {
      const api = creative.generatedBy || 'Unknown';
      stats[api] = (stats[api] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);

    console.log(`Final results: Generated ${creatives.length} creatives with total cost: $${totalCost.toFixed(4)}`);
    console.log('API usage stats:', apiUsageStats);

    return new Response(
      JSON.stringify({ 
        success: true,
        creatives,
        concepts,
        totalGenerated: creatives.length,
        totalCost: parseFloat(totalCost.toFixed(4)),
        apiUsageStats,
        optimization: {
          selectedStrategy: selectedAPI,
          availableAPIs: Object.keys(API_CONFIGS),
          recommendation: estimatedImages > 20 ? 'Consider bulk generation with Replicate for cost efficiency' : 'OpenAI provides best quality for this batch size'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating creatives:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
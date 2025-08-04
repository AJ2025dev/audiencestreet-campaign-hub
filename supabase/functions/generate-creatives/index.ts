import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl, creativeBrief, environments, creativeTypes } = await req.json();
    
    console.log('Received request:', { websiteUrl, creativeBrief, environments, creativeTypes });
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    
    console.log('API Keys available:', { 
      openAI: !!openAIApiKey, 
      hf: !!hfToken 
    });
    
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const hf = new HfInference(hfToken);
    const creatives = [];

    // Analyze website if URL provided
    let brandInfo = '';
    let websiteContent = '';
    if (websiteUrl) {
      try {
        console.log('Analyzing website:', websiteUrl);
        const websiteResponse = await fetch(websiteUrl);
        const html = await websiteResponse.text();
        
        // Extract comprehensive brand info
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
        const keywordsMatch = html.match(/<meta name="keywords" content="(.*?)"/i);
        
        // Extract text content for analysis
        let textContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Take first 2000 characters for analysis
        websiteContent = textContent.substring(0, 2000);
        
        brandInfo = `Title: ${titleMatch?.[1] || 'Unknown'}
Description: ${descMatch?.[1] || 'No description available'}
Keywords: ${keywordsMatch?.[1] || 'Not specified'}
Content Preview: ${websiteContent.substring(0, 500)}...`;
        
        console.log('Extracted brand info:', brandInfo.substring(0, 200) + '...');
      } catch (e) {
        console.log('Could not analyze website:', e);
        brandInfo = `Website analysis failed for ${websiteUrl}`;
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
            content: `Create 3 highly-targeted, conversion-focused creative concepts for:

BRAND ANALYSIS:
Website: ${websiteUrl || 'Not provided'}
Brand Info: ${brandInfo}
Creative Brief: ${creativeBrief || 'Not provided'}
Target Environments: ${environments?.join(', ') || 'All platforms'}
Creative Types: ${creativeTypes?.join(', ') || 'All formats'}

For each concept, provide EXACT content in this JSON format:
{
  "concept1": {
    "headline": "6-word compelling headline",
    "subtext": "15-word benefit-focused supporting text",
    "cta": "3-word action verb",
    "visualPrompt": "Detailed 50-word visual description including colors, composition, style, emotions, and brand elements",
    "strategy": "Why this concept converts"
  },
  "concept2": {...},
  "concept3": {...}
}

Focus on:
- Emotional triggers and pain points
- Clear value propositions
- Professional, modern aesthetic
- Brand-appropriate messaging
- Conversion-optimized design elements`
          }
        ],
      }),
    });

    const conceptData = await conceptResponse.json();
    const conceptsText = conceptData.choices[0].message.content;
    
    // Parse the JSON response
    let concepts;
    try {
      concepts = JSON.parse(conceptsText);
    } catch (e) {
      // Fallback if JSON parsing fails
      concepts = {
        concept1: {
          headline: "Transform Your Business",
          subtext: "Innovative solutions that drive growth and success",
          cta: "Get Started",
          visualPrompt: "Professional business imagery with modern technology elements, clean corporate design, confident professionals, bright lighting, premium brand aesthetic, growth-focused visuals",
          strategy: "Appeals to business transformation desires"
        }
      };
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
          // Generate high-quality banner using OpenAI's image generation
          const detailedPrompt = `Professional advertising banner design: ${concept.visualPrompt}. Include headline "${concept.headline}" and call-to-action "${concept.cta}". Modern typography, ${size.width}x${size.height} dimensions, advertising layout, marketing design, brand-focused, high-resolution, professional quality.`;
          
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
              quality: 'hd',
              response_format: 'b64_json'
            }),
          });

          const imageData = await imageResponse.json();
          console.log(`Image generation response for ${size.name}:`, imageData);
          
          if (imageData.data && imageData.data[0] && imageData.data[0].b64_json) {
            creatives.push({
              type: 'banner',
              size: size.name,
              dimensions: `${size.width}x${size.height}`,
              image: `data:image/png;base64,${imageData.data[0].b64_json}`,
              headline: concept.headline,
              subtext: concept.subtext,
              cta: concept.cta,
              concept: concept.strategy
            });
            console.log(`Successfully generated ${size.name} banner`);
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
    
    if (shouldGenerateVideo) {
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
            
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-image-1',
                prompt: scene.prompt,
                n: 1,
                size: '1536x1024', // 16:9 aspect ratio
                quality: 'high',
                output_format: 'png'
              }),
            });

            const imageData = await imageResponse.json();
            
            if (imageData.data && imageData.data[0] && imageData.data[0].b64_json) {
              keyframes.push({
                scene: i + 1,
                timestamp: scene.time,
                image: `data:image/png;base64,${imageData.data[0].b64_json}`,
                description: scene.description,
                script: scene.prompt
              });
            }
          } catch (error) {
            console.error(`Error generating keyframe ${i + 1}:`, error);
          }
        }

        if (keyframes.length > 0) {
          creatives.push({
            type: 'video',
            duration: '30s',
            keyframes,
            headline: firstConcept.headline,
            concept: firstConcept.strategy,
            format: '16:9 Video (1536x1024)'
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

    return new Response(
      JSON.stringify({ 
        success: true,
        creatives,
        concepts,
        totalGenerated: creatives.length
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
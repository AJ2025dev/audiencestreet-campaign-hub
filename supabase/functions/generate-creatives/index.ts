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
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    
    if (!openAIApiKey || !hfToken) {
      throw new Error('Missing required API keys');
    }

    const hf = new HfInference(hfToken);
    const creatives = [];

    // Analyze website if URL provided
    let brandInfo = '';
    if (websiteUrl) {
      try {
        const websiteResponse = await fetch(websiteUrl);
        const html = await websiteResponse.text();
        // Extract basic brand info from title and meta description
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
        brandInfo = `Brand: ${titleMatch?.[1] || 'Unknown'}, Description: ${descMatch?.[1] || 'No description'}`;
      } catch (e) {
        console.log('Could not analyze website:', e);
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert creative director. Generate compelling ad copy and visual concepts for digital advertising.'
          },
          {
            role: 'user',
            content: `Create 3 different creative concepts for these requirements:
            Website: ${websiteUrl || 'Not provided'}
            Brand Info: ${brandInfo}
            Creative Brief: ${creativeBrief || 'Not provided'}
            Environments: ${environments?.join(', ') || 'All'}
            Types: ${creativeTypes?.join(', ') || 'All'}
            
            For each concept, provide:
            1. A compelling headline (max 6 words)
            2. Supporting text (max 15 words)
            3. Visual description for banner generation
            4. Call-to-action (max 3 words)`
          }
        ],
      }),
    });

    const conceptData = await conceptResponse.json();
    const concepts = conceptData.choices[0].message.content;

    // Generate banners for different sizes
    const bannerSizes = [
      { width: 728, height: 90, name: 'leaderboard' },
      { width: 300, height: 250, name: 'medium-rectangle' },
      { width: 320, height: 50, name: 'mobile-banner' },
      { width: 300, height: 600, name: 'skyscraper' }
    ];

    for (const size of bannerSizes) {
      try {
        const prompt = `Professional advertising banner, ${creativeBrief || 'modern business'}, clean design, brand colors, ${size.width}x${size.height} aspect ratio, high quality, marketing banner, ${brandInfo}`;
        
        const image = await hf.textToImage({
          inputs: prompt,
          model: 'black-forest-labs/FLUX.1-schnell',
        });

        const arrayBuffer = await image.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        creatives.push({
          type: 'banner',
          size: size.name,
          dimensions: `${size.width}x${size.height}`,
          image: `data:image/png;base64,${base64}`,
          concept: concepts.split('\n')[0] // Use first concept
        });
      } catch (error) {
        console.error(`Error generating ${size.name} banner:`, error);
      }
    }

    // Generate video concepts with actual visual keyframes
    const hasVideoTypes = creativeTypes?.some(type => 
      type.includes('Video') || type.includes('video') || type.includes('Rich Media') || type.includes('Interactive') || type.includes('Native')
    );
    
    if (hasVideoTypes || creativeTypes?.includes('Video Ads (15s, 30s)')) {
      try {
        // Generate 4 keyframes for a 30-second video
        const keyframePrompts = [
          `Opening scene: ${creativeBrief || 'modern business'} brand introduction, professional, clean, ${brandInfo}`,
          `Product showcase: ${creativeBrief || 'modern business'} main product/service, engaging, ${brandInfo}`,
          `Benefits highlight: ${creativeBrief || 'modern business'} key benefits, compelling, ${brandInfo}`,
          `Call to action: ${creativeBrief || 'modern business'} strong CTA, professional finish, ${brandInfo}`
        ];

        const keyframes = [];
        for (let i = 0; i < keyframePrompts.length; i++) {
          try {
            const keyframeImage = await hf.textToImage({
              inputs: `${keyframePrompts[i]}, 16:9 aspect ratio, high quality, video frame, advertising`,
              model: 'black-forest-labs/FLUX.1-schnell',
            });

            const arrayBuffer = await keyframeImage.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            
            keyframes.push({
              scene: i + 1,
              timestamp: `${i * 7}s`,
              image: `data:image/png;base64,${base64}`,
              description: keyframePrompts[i]
            });
          } catch (error) {
            console.error(`Error generating keyframe ${i + 1}:`, error);
          }
        }

        creatives.push({
          type: 'video',
          duration: '30s',
          keyframes,
          concept: 'Video advertising with visual keyframes',
          format: '16:9 Video'
        });
      } catch (error) {
        console.error('Error generating video keyframes:', error);
      }
    }

    // Generate Rich Media concepts
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
    creatives.push({
      type: 'rich-media',
      format: 'Expandable Banner',
      concept: richMediaData.choices[0].message.content.split('\n')[0],
      description: richMediaData.choices[0].message.content
    });

    creatives.push({
      type: 'native',
      format: 'Native Article',
      concept: 'Native advertising concept',
      description: richMediaData.choices[0].message.content.split('\n').slice(1).join('\n')
    });

    creatives.push({
      type: 'interactive',
      format: 'Interactive Video Overlay',
      concept: 'Interactive advertising concept',
      description: richMediaData.choices[0].message.content
    });

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
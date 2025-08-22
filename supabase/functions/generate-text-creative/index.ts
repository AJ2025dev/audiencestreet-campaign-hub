import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product, audience } = await req.json();
    
    // Validate parameters
    if (!product || !audience) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: product and audience' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Generate creative text using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert copywriter specializing in creating compelling advertising copy for digital campaigns. Create concise, engaging, and persuasive text creatives that drive action.'
          },
          {
            role: 'user',
            content: `Create a compelling text creative for ${product} targeting ${audience}. Include:
1. A catchy headline (max 60 characters)
2. A persuasive description (max 90 characters)
3. A clear call-to-action (max 30 characters)`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorData);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API rate limit exceeded. Please try again in a few minutes.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || response.statusText}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status 
        }
      )
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return new Response(
        JSON.stringify({ error: 'Invalid response from OpenAI API' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
    // Parse the response to extract headline, description, and CTA
    const creativeText = data.choices[0].message.content;
    
    // Simple parsing - in a real implementation, you might want more sophisticated parsing
    const lines = creativeText.split('\n').filter(line => line.trim() !== '');
    const creative = {
      headline: lines[0]?.replace(/^\d+\.\s*/, '').trim() || 'Compelling Headline',
      description: lines[1]?.replace(/^\d+\.\s*/, '').trim() || 'Persuasive description',
      cta: lines[2]?.replace(/^\d+\.\s*/, '').trim() || 'Click Here'
    };

    return new Response(
      JSON.stringify(creative),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating text creative:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate text creative' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
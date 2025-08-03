import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { brandDescription, campaignObjective, landingPage } = await req.json()

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    const systemPrompt = `You are an expert digital advertising strategist. Based on the provided brand information and campaign objectives, generate a comprehensive campaign strategy that includes:

1. Target Audience Analysis
2. Key Messaging Recommendations  
3. Channel Strategy (DSP/SSP recommendations)
4. Budget Allocation Suggestions
5. Creative Direction
6. KPI Recommendations
7. Optimization Tactics

Be specific, actionable, and data-driven in your recommendations.`

    const userPrompt = `
Brand/Product Description: ${brandDescription}
Campaign Objective: ${campaignObjective}
${landingPage ? `Landing Page: ${landingPage}` : ''}

Please generate a comprehensive campaign strategy based on this information.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const strategy = data.choices[0].message.content

    return new Response(
      JSON.stringify({ strategy }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating campaign strategy:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate campaign strategy' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
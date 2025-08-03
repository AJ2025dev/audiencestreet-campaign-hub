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
    const { 
      brandDescription, 
      campaignObjective, 
      landingPage,
      platformContext 
    } = await req.json()

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

    // Available platform options for context-aware recommendations
    const availableDSPs = [
      { name: "The Trade Desk", type: "Premium DSP", bestFor: ["Display", "Video", "CTV", "Audio"] },
      { name: "Amazon DSP", type: "Retail Media", bestFor: ["E-commerce", "Product Sales", "Shopping Intent"] },
      { name: "Google DV360", type: "Video & Display", bestFor: ["YouTube", "Display", "Video", "App Campaigns"] },
      { name: "Adobe Advertising Cloud", type: "Cross-Channel", bestFor: ["Omnichannel", "Cross-device", "Attribution"] },
      { name: "Verizon Media DSP", type: "Native & Video", bestFor: ["Native", "Video", "Mobile", "Yahoo Properties"] },
      { name: "Samsung DSP", type: "CTV & Mobile", bestFor: ["Connected TV", "Smart TV", "Mobile", "Samsung Ecosystem"] }
    ]

    const availableSSPs = [
      { name: "Google Ad Manager", type: "Premium Inventory" },
      { name: "PubMatic", type: "Header Bidding" },
      { name: "Rubicon Project", type: "Real-time Bidding" },
      { name: "AppNexus/Xandr", type: "Programmatic" },
      { name: "OpenX", type: "Video & Mobile" },
      { name: "Index Exchange", type: "Header Bidding" }
    ]

    const availableEnvironments = ["CTV/OTT", "In-App", "Web", "PdOOH"]
    
    const retailMediaSegments = [
      "Cart Abandoners", "High-Value Shoppers", "Frequent Purchasers", "Price-Sensitive Shoppers",
      "Brand Loyalists", "Category Browsers", "Seasonal Shoppers", "New Customers", 
      "Cross-Sell Opportunities", "Upsell Candidates", "Lapsed Customers", "VIP Customers"
    ]

    const retailPartners = [
      "Amazon", "Walmart", "Target", "Best Buy", "Home Depot", "CVS", "Walgreens", 
      "Kroger", "Costco", "Sam's Club", "Lowe's", "Macy's", "Nordstrom"
    ]

    const systemPrompt = `You are an expert digital advertising strategist for a programmatic advertising platform. Based on the provided brand information, campaign objectives, and platform capabilities, generate a comprehensive, platform-specific campaign strategy.

CRITICAL: Your recommendations must ONLY include options available on this platform. Do not recommend external solutions or platforms not listed.

AVAILABLE PLATFORM OPTIONS:
DSPs: ${availableDSPs.map(dsp => `${dsp.name} (${dsp.type}) - Best for: ${dsp.bestFor.join(', ')}`).join(' | ')}
SSPs: ${availableSSPs.map(ssp => `${ssp.name} (${ssp.type})`).join(' | ')}
Environments: ${availableEnvironments.join(', ')}
Bidding Strategies: CPM, CPC, CPA, vCPM, Dynamic Bidding

RETAIL MEDIA CAPABILITIES:
Available Segments: ${retailMediaSegments.join(', ')}
Retail Partners: ${retailPartners.join(', ')}

Generate a strategy that includes:
1. **Platform-Specific DSP/SSP Recommendations** - Only recommend from available options above
2. **Environment Strategy** - Specify which environments (CTV/OTT, In-App, Web, PdOOH) to prioritize
3. **Retail Media Integration** - Include relevant retail media segments and partners when applicable
4. **Budget Allocation** - Distribute budget across recommended DSPs and environments
5. **Bidding Strategy** - Choose from available bidding options
6. **Creative Specifications** - Based on selected environments and formats
7. **Audience Targeting** - Include behavioral segments and retail data when relevant
8. **KPI Framework** - Metrics measurable within the platform
9. **Optimization Roadmap** - Platform-specific optimization tactics

RETAIL MEDIA PRIORITIZATION:
- For e-commerce, retail, shopping, or product-focused campaigns: Emphasize Amazon DSP and retail media segments
- For brand awareness: Focus on premium DSPs and broad reach environments
- For conversions: Prioritize performance-oriented DSPs and conversion-focused segments

Be specific, actionable, and ensure all recommendations are implementable within the platform.`

    let contextualPrompt = `
Brand/Product Description: ${brandDescription}
Campaign Objective: ${campaignObjective}
${landingPage ? `Landing Page: ${landingPage}` : ''}`

    // Add platform context if provided
    if (platformContext) {
      contextualPrompt += `

CURRENT PLATFORM SELECTIONS:
${platformContext.selectedDSPs?.length ? `Selected DSPs: ${platformContext.selectedDSPs.join(', ')}` : ''}
${platformContext.selectedSSPs?.length ? `Selected SSPs: ${platformContext.selectedSSPs.join(', ')}` : ''}
${platformContext.environments?.length ? `Target Environments: ${platformContext.environments.join(', ')}` : ''}
${platformContext.budget ? `Budget: ${platformContext.budget}` : ''}
${platformContext.targetAudience ? `Target Audience: ${platformContext.targetAudience}` : ''}`
    }

    contextualPrompt += `

Please generate a comprehensive, platform-specific campaign strategy that leverages the available DSPs, SSPs, environments, and retail media capabilities. Focus on actionable recommendations that can be implemented immediately within the platform.`

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
          { role: 'user', content: contextualPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }))
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorData)
      
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

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return new Response(
        JSON.stringify({ error: 'Invalid response from OpenAI API' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
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
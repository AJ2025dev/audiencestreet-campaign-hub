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
    const url = new URL(req.url)
    const base = parseFloat(url.searchParams.get('base') || '0')
    const agency_pct = parseFloat(url.searchParams.get('agency_pct') || '0')
    const admin_pct = parseFloat(url.searchParams.get('admin_pct') || '0')

    // Validate parameters
    if (isNaN(base) || isNaN(agency_pct) || isNaN(admin_pct)) {
      return new Response(
        JSON.stringify({ error: 'Invalid parameters. base, agency_pct, and admin_pct must be numbers.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Calculate prices
    const agencyMargin = base * (agency_pct / 100)
    const adminBuffer = base * (admin_pct / 100)
    const finalPrice = base + agencyMargin + adminBuffer

    const result = {
      base_price: base,
      agency_margin_percent: agency_pct,
      agency_margin_amount: agencyMargin,
      admin_buffer_percent: admin_pct,
      admin_buffer_amount: adminBuffer,
      final_price: finalPrice
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error calculating campaign price:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to calculate campaign price' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
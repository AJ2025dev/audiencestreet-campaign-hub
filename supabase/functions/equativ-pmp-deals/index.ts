import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, dealData, dealId } = await req.json();
    const equativApiKey = Deno.env.get('EQUATIV_API_KEY');
    
    if (!equativApiKey) {
      throw new Error('EQUATIV_API_KEY not configured');
    }

    const baseUrl = 'https://buyerconnectapis.smartadserver.com/activation/v1';
    const headers = {
      'Authorization': `Bearer ${equativApiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    let response;
    let result;

    switch (action) {
      case 'list_available_deals':
        console.log('Listing available PMP deals');
        const queryParams = new URLSearchParams();
        if (dealData?.status) queryParams.append('status', dealData.status);
        if (dealData?.publisherId) queryParams.append('publisherId', dealData.publisherId);
        if (dealData?.adFormat) queryParams.append('adFormat', dealData.adFormat);
        
        response = await fetch(`${baseUrl}/deals?${queryParams.toString()}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_deal_details':
        console.log('Fetching PMP deal details:', dealId);
        response = await fetch(`${baseUrl}/deals/${dealId}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'negotiate_deal':
        console.log('Negotiating PMP deal:', dealData);
        response = await fetch(`${baseUrl}/deals/negotiate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dealId: dealData.dealId,
            proposedPrice: dealData.proposedPrice,
            currency: dealData.currency || 'USD',
            floorPrice: dealData.floorPrice,
            impressions: dealData.impressions,
            startDate: dealData.startDate,
            endDate: dealData.endDate,
            targeting: dealData.targeting || {},
            terms: dealData.terms || {}
          })
        });
        result = await response.json();
        break;

      case 'accept_deal':
        console.log('Accepting PMP deal:', dealId);
        response = await fetch(`${baseUrl}/deals/${dealId}/accept`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            terms: dealData.terms || {},
            budget: dealData.budget
          })
        });
        result = await response.json();
        break;

      case 'reject_deal':
        console.log('Rejecting PMP deal:', dealId);
        response = await fetch(`${baseUrl}/deals/${dealId}/reject`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            reason: dealData.reason || 'Terms not acceptable'
          })
        });
        result = await response.json();
        break;

      case 'get_deal_performance':
        console.log('Fetching PMP deal performance:', dealId);
        response = await fetch(`${baseUrl}/deals/${dealId}/performance`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'pause_deal':
        console.log('Pausing PMP deal:', dealId);
        response = await fetch(`${baseUrl}/deals/${dealId}/pause`, {
          method: 'POST',
          headers
        });
        result = await response.json();
        break;

      case 'resume_deal':
        console.log('Resuming PMP deal:', dealId);
        response = await fetch(`${baseUrl}/deals/${dealId}/resume`, {
          method: 'POST',
          headers
        });
        result = await response.json();
        break;

      case 'create_preferred_deal':
        console.log('Creating preferred deal:', dealData);
        response = await fetch(`${baseUrl}/deals/preferred`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: dealData.name,
            publisherId: dealData.publisherId,
            inventoryType: dealData.inventoryType,
            adFormats: dealData.adFormats || [],
            pricing: {
              type: dealData.pricingType || 'CPM',
              amount: dealData.price,
              currency: dealData.currency || 'USD'
            },
            targeting: dealData.targeting || {},
            startDate: dealData.startDate,
            endDate: dealData.endDate,
            priority: dealData.priority || 1
          })
        });
        result = await response.json();
        break;

      case 'get_deal_recommendations':
        console.log('Getting deal recommendations:', dealData);
        response = await fetch(`${baseUrl}/deals/recommendations`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            budget: dealData.budget,
            targeting: dealData.targeting,
            objectives: dealData.objectives || ['reach'],
            constraints: dealData.constraints || {}
          })
        });
        result = await response.json();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      console.error('Equativ PMP Deals API error:', response.status, result);
      throw new Error(`Equativ PMP Deals API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Equativ PMP deals operation successful:', action, result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in equativ-pmp-deals:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to execute Equativ PMP deals operation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
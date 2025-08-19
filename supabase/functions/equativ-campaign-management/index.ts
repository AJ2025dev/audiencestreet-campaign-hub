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
    const { action, campaignData, campaignId } = await req.json();
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
      case 'create_campaign':
        console.log('Creating Equativ campaign:', campaignData);
        response = await fetch(`${baseUrl}/campaigns`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: campaignData.name,
            status: campaignData.status || 'PAUSED',
            budget: {
              amount: campaignData.budget,
              currency: campaignData.currency || 'USD'
            },
            startDate: campaignData.startDate,
            endDate: campaignData.endDate,
            targeting: campaignData.targeting || {},
            creatives: campaignData.creatives || []
          })
        });
        result = await response.json();
        break;

      case 'update_campaign':
        console.log('Updating Equativ campaign:', campaignId, campaignData);
        response = await fetch(`${baseUrl}/campaigns/${campaignId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(campaignData)
        });
        result = await response.json();
        break;

      case 'get_campaign':
        console.log('Fetching Equativ campaign:', campaignId);
        response = await fetch(`${baseUrl}/campaigns/${campaignId}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'list_campaigns':
        console.log('Listing Equativ campaigns');
        response = await fetch(`${baseUrl}/campaigns`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'pause_campaign':
        console.log('Pausing Equativ campaign:', campaignId);
        response = await fetch(`${baseUrl}/campaigns/${campaignId}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: 'PAUSED' })
        });
        result = await response.json();
        break;

      case 'activate_campaign':
        console.log('Activating Equativ campaign:', campaignId);
        response = await fetch(`${baseUrl}/campaigns/${campaignId}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: 'ACTIVE' })
        });
        result = await response.json();
        break;

      case 'get_campaign_stats':
        console.log('Fetching campaign statistics:', campaignId);
        response = await fetch(`${baseUrl}/campaigns/${campaignId}/stats`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      console.error('Equativ API error:', response.status, result);
      throw new Error(`Equativ API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Equativ campaign operation successful:', action, result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in equativ-campaign-management:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to execute Equativ campaign operation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
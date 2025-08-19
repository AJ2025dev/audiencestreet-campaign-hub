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
    const { action, filters, inventoryId } = await req.json();
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
      case 'get_inventory':
        console.log('Fetching inventory with filters:', filters);
        const queryParams = new URLSearchParams();
        if (filters?.geography) queryParams.append('geography', filters.geography);
        if (filters?.adFormat) queryParams.append('adFormat', filters.adFormat);
        if (filters?.deviceType) queryParams.append('deviceType', filters.deviceType);
        if (filters?.category) queryParams.append('category', filters.category);
        
        response = await fetch(`${baseUrl}/inventory?${queryParams.toString()}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_inventory_details':
        console.log('Fetching inventory details:', inventoryId);
        response = await fetch(`${baseUrl}/inventory/${inventoryId}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_inventory_forecast':
        console.log('Getting inventory forecast:', filters);
        response = await fetch(`${baseUrl}/inventory/forecast`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            targeting: filters?.targeting || {},
            dateRange: {
              startDate: filters?.startDate,
              endDate: filters?.endDate
            },
            budget: filters?.budget,
            adFormat: filters?.adFormat
          })
        });
        result = await response.json();
        break;

      case 'get_inventory_pricing':
        console.log('Fetching inventory pricing:', inventoryId);
        response = await fetch(`${baseUrl}/inventory/${inventoryId}/pricing`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_available_formats':
        console.log('Fetching available ad formats');
        response = await fetch(`${baseUrl}/inventory/formats`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_geography_inventory':
        console.log('Fetching geography-based inventory:', filters?.geography);
        response = await fetch(`${baseUrl}/inventory/geography/${filters?.geography}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_inventory_metrics':
        console.log('Fetching inventory performance metrics');
        response = await fetch(`${baseUrl}/inventory/metrics`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            inventoryIds: filters?.inventoryIds || [],
            dateRange: {
              startDate: filters?.startDate,
              endDate: filters?.endDate
            },
            metrics: ['impressions', 'ctr', 'cost', 'conversions']
          })
        });
        result = await response.json();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      console.error('Equativ Inventory API error:', response.status, result);
      throw new Error(`Equativ Inventory API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Equativ inventory operation successful:', action, result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in equativ-inventory-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to execute Equativ inventory operation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
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
    const { action, planData, planId } = await req.json();
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
      case 'create_media_plan':
        console.log('Creating media plan:', planData);
        response = await fetch(`${baseUrl}/media-plans`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: planData.name,
            description: planData.description,
            budget: {
              total: planData.totalBudget,
              currency: planData.currency || 'USD'
            },
            dateRange: {
              startDate: planData.startDate,
              endDate: planData.endDate
            },
            targeting: planData.targeting || {},
            channels: planData.channels || [],
            objectives: planData.objectives || []
          })
        });
        result = await response.json();
        break;

      case 'get_media_plan':
        console.log('Fetching media plan:', planId);
        response = await fetch(`${baseUrl}/media-plans/${planId}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'update_media_plan':
        console.log('Updating media plan:', planId, planData);
        response = await fetch(`${baseUrl}/media-plans/${planId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(planData)
        });
        result = await response.json();
        break;

      case 'optimize_media_plan':
        console.log('Optimizing media plan:', planId);
        response = await fetch(`${baseUrl}/media-plans/${planId}/optimize`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            objectives: planData.objectives || ['reach', 'frequency'],
            constraints: planData.constraints || {},
            preferences: planData.preferences || {}
          })
        });
        result = await response.json();
        break;

      case 'get_reach_forecast':
        console.log('Getting reach forecast:', planData);
        response = await fetch(`${baseUrl}/media-plans/forecast/reach`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            targeting: planData.targeting,
            budget: planData.budget,
            dateRange: {
              startDate: planData.startDate,
              endDate: planData.endDate
            },
            channels: planData.channels
          })
        });
        result = await response.json();
        break;

      case 'get_budget_allocation':
        console.log('Getting budget allocation recommendations:', planData);
        response = await fetch(`${baseUrl}/media-plans/budget-allocation`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            totalBudget: planData.totalBudget,
            channels: planData.channels,
            objectives: planData.objectives,
            targeting: planData.targeting
          })
        });
        result = await response.json();
        break;

      case 'simulate_plan_performance':
        console.log('Simulating plan performance:', planId);
        response = await fetch(`${baseUrl}/media-plans/${planId}/simulate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            scenarios: planData.scenarios || [],
            metrics: ['impressions', 'reach', 'frequency', 'cost']
          })
        });
        result = await response.json();
        break;

      case 'export_media_plan':
        console.log('Exporting media plan:', planId);
        response = await fetch(`${baseUrl}/media-plans/${planId}/export`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            format: planData.format || 'xlsx',
            includeCharts: planData.includeCharts || true
          })
        });
        result = await response.json();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      console.error('Equativ Media Planning API error:', response.status, result);
      throw new Error(`Equativ Media Planning API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Equativ media planning operation successful:', action, result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in equativ-media-planning:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to execute Equativ media planning operation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
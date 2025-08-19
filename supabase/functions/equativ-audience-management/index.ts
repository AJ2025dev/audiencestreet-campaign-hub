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
    const { action, audienceData, audienceId } = await req.json();
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
      case 'create_audience':
        console.log('Creating audience:', audienceData);
        response = await fetch(`${baseUrl}/audiences`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: audienceData.name,
            description: audienceData.description,
            type: audienceData.type || 'CUSTOM',
            rules: audienceData.rules || [],
            dataSource: audienceData.dataSource || 'FIRST_PARTY',
            ttl: audienceData.ttl || 30, // days
            isShared: audienceData.isShared || false
          })
        });
        result = await response.json();
        break;

      case 'update_audience':
        console.log('Updating audience:', audienceId, audienceData);
        response = await fetch(`${baseUrl}/audiences/${audienceId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(audienceData)
        });
        result = await response.json();
        break;

      case 'get_audience':
        console.log('Fetching audience:', audienceId);
        response = await fetch(`${baseUrl}/audiences/${audienceId}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'list_audiences':
        console.log('Listing audiences');
        const queryParams = new URLSearchParams();
        if (audienceData?.type) queryParams.append('type', audienceData.type);
        if (audienceData?.status) queryParams.append('status', audienceData.status);
        
        response = await fetch(`${baseUrl}/audiences?${queryParams.toString()}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'upload_audience_data':
        console.log('Uploading audience data:', audienceId);
        response = await fetch(`${baseUrl}/audiences/${audienceId}/upload`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            data: audienceData.data || [],
            format: audienceData.format || 'EMAIL_HASH',
            matchType: audienceData.matchType || 'EXACT',
            overwriteExisting: audienceData.overwriteExisting || false
          })
        });
        result = await response.json();
        break;

      case 'delete_audience':
        console.log('Deleting audience:', audienceId);
        response = await fetch(`${baseUrl}/audiences/${audienceId}`, {
          method: 'DELETE',
          headers
        });
        result = await response.json();
        break;

      case 'get_audience_insights':
        console.log('Fetching audience insights:', audienceId);
        response = await fetch(`${baseUrl}/audiences/${audienceId}/insights`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'create_lookalike_audience':
        console.log('Creating lookalike audience:', audienceData);
        response = await fetch(`${baseUrl}/audiences/lookalike`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: audienceData.name,
            seedAudienceId: audienceData.seedAudienceId,
            similarity: audienceData.similarity || 0.8, // 0.1 to 1.0
            targetSize: audienceData.targetSize,
            geography: audienceData.geography || [],
            excludeSeeds: audienceData.excludeSeeds || false
          })
        });
        result = await response.json();
        break;

      case 'combine_audiences':
        console.log('Combining audiences:', audienceData);
        response = await fetch(`${baseUrl}/audiences/combine`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: audienceData.name,
            operation: audienceData.operation || 'UNION', // UNION, INTERSECT, EXCLUDE
            audienceIds: audienceData.audienceIds || [],
            description: audienceData.description
          })
        });
        result = await response.json();
        break;

      case 'get_audience_overlap':
        console.log('Getting audience overlap analysis:', audienceData);
        response = await fetch(`${baseUrl}/audiences/overlap`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            audienceIds: audienceData.audienceIds || []
          })
        });
        result = await response.json();
        break;

      case 'get_third_party_audiences':
        console.log('Fetching third-party audiences');
        response = await fetch(`${baseUrl}/audiences/third-party`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'estimate_audience_reach':
        console.log('Estimating audience reach:', audienceData);
        response = await fetch(`${baseUrl}/audiences/reach-estimate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            targeting: audienceData.targeting || {},
            geography: audienceData.geography || [],
            demographics: audienceData.demographics || {},
            interests: audienceData.interests || []
          })
        });
        result = await response.json();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      console.error('Equativ Audience Management API error:', response.status, result);
      throw new Error(`Equativ Audience Management API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Equativ audience management operation successful:', action, result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in equativ-audience-management:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to execute Equativ audience management operation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
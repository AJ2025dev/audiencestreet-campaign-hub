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
    console.log('Fetching TAS inventory data...');
    
    // In a real implementation, you would use the TAS API
    // For now, we'll return mock data structure
    const mockInventoryData = {
      success: true,
      inventory: [
        {
          id: 'tas_001',
          name: 'TAS Premium Video Network',
          category: 'video',
          format: 'pre-roll',
          size: '16:9',
          available_impressions: 8500000,
          cpm_range: { min: 3.25, max: 6.50 },
          targeting_options: ['demographic', 'behavioral', 'contextual', 'geo'],
          reach_estimate: 4200000,
          geography: ['US', 'CA', 'UK', 'FR', 'DE'],
          demographics: { age_range: '18-65', gender: ['M', 'F'] },
          brand_safety: true,
          viewability_rate: 0.85
        },
        {
          id: 'tas_002',
          name: 'TAS Mobile Display Premium',
          category: 'display',
          format: 'banner',
          size: '320x50',
          available_impressions: 15000000,
          cpm_range: { min: 1.50, max: 3.75 },
          targeting_options: ['location', 'device', 'demographic', 'interest'],
          reach_estimate: 12000000,
          geography: ['US', 'CA', 'MX'],
          demographics: { age_range: '18-54', gender: ['M', 'F'] },
          brand_safety: true,
          viewability_rate: 0.78
        },
        {
          id: 'tas_003',
          name: 'TAS Connected TV Premium',
          category: 'video',
          format: 'video',
          size: '16:9',
          available_impressions: 3500000,
          cpm_range: { min: 12.00, max: 25.00 },
          targeting_options: ['household', 'behavioral', 'contextual', 'lookalike'],
          reach_estimate: 2800000,
          geography: ['US'],
          demographics: { age_range: '25-65', gender: ['M', 'F'] },
          brand_safety: true,
          viewability_rate: 0.92
        },
        {
          id: 'tas_004',
          name: 'TAS Native Content Network',
          category: 'native',
          format: 'native',
          size: 'responsive',
          available_impressions: 6200000,
          cpm_range: { min: 2.80, max: 5.20 },
          targeting_options: ['contextual', 'behavioral', 'demographic'],
          reach_estimate: 4800000,
          geography: ['US', 'CA', 'UK'],
          demographics: { age_range: '22-55', gender: ['M', 'F'] },
          brand_safety: true,
          viewability_rate: 0.81
        },
        {
          id: 'tas_005',
          name: 'TAS Audio Streaming Premium',
          category: 'audio',
          format: 'audio',
          size: '30s',
          available_impressions: 2100000,
          cpm_range: { min: 8.50, max: 18.00 },
          targeting_options: ['demographic', 'behavioral', 'geo', 'dayparting'],
          reach_estimate: 1650000,
          geography: ['US', 'CA'],
          demographics: { age_range: '18-54', gender: ['M', 'F'] },
          brand_safety: true,
          viewability_rate: 1.0
        }
      ],
      total_available_impressions: 35300000,
      last_updated: new Date().toISOString()
    };

    console.log(`Returning ${mockInventoryData.inventory.length} inventory items`);

    return new Response(
      JSON.stringify(mockInventoryData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error fetching inventory:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch inventory data',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})
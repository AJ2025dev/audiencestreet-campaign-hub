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
    const { action, trackingData, campaignId, dateRange } = await req.json();
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
      case 'get_campaign_metrics':
        console.log('Fetching campaign metrics:', campaignId, dateRange);
        const metricsParams = new URLSearchParams();
        if (dateRange?.startDate) metricsParams.append('startDate', dateRange.startDate);
        if (dateRange?.endDate) metricsParams.append('endDate', dateRange.endDate);
        if (trackingData?.groupBy) metricsParams.append('groupBy', trackingData.groupBy);
        
        response = await fetch(`${baseUrl}/tracking/campaigns/${campaignId}/metrics?${metricsParams.toString()}`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_real_time_stats':
        console.log('Fetching real-time campaign stats:', campaignId);
        response = await fetch(`${baseUrl}/tracking/campaigns/${campaignId}/realtime`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'create_conversion_tracking':
        console.log('Creating conversion tracking:', trackingData);
        response = await fetch(`${baseUrl}/tracking/conversions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: trackingData.name,
            type: trackingData.type || 'POSTBACK', // PIXEL, POSTBACK, SERVER_TO_SERVER
            campaignIds: trackingData.campaignIds || [],
            conversionWindow: trackingData.conversionWindow || 30, // days
            attributionModel: trackingData.attributionModel || 'LAST_CLICK',
            url: trackingData.url,
            parameters: trackingData.parameters || {}
          })
        });
        result = await response.json();
        break;

      case 'get_conversion_data':
        console.log('Fetching conversion data:', trackingData);
        response = await fetch(`${baseUrl}/tracking/conversions/data`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            campaignIds: trackingData.campaignIds || [],
            dateRange: {
              startDate: dateRange?.startDate,
              endDate: dateRange?.endDate
            },
            groupBy: trackingData.groupBy || ['date'],
            metrics: trackingData.metrics || ['conversions', 'conversion_rate', 'cost_per_conversion']
          })
        });
        result = await response.json();
        break;

      case 'get_attribution_report':
        console.log('Generating attribution report:', trackingData);
        response = await fetch(`${baseUrl}/tracking/attribution`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            campaignIds: trackingData.campaignIds || [],
            attributionModel: trackingData.attributionModel || 'LAST_CLICK',
            conversionWindow: trackingData.conversionWindow || 30,
            dateRange: {
              startDate: dateRange?.startDate,
              endDate: dateRange?.endDate
            },
            includeViewThrough: trackingData.includeViewThrough || false
          })
        });
        result = await response.json();
        break;

      case 'setup_pixel_tracking':
        console.log('Setting up pixel tracking:', trackingData);
        response = await fetch(`${baseUrl}/tracking/pixels`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            campaignId: trackingData.campaignId,
            pixelType: trackingData.pixelType || 'CONVERSION',
            triggers: trackingData.triggers || ['PAGE_VIEW'],
            customEvents: trackingData.customEvents || [],
            dataLayer: trackingData.dataLayer || {}
          })
        });
        result = await response.json();
        break;

      case 'get_viewability_metrics':
        console.log('Fetching viewability metrics:', campaignId);
        response = await fetch(`${baseUrl}/tracking/campaigns/${campaignId}/viewability`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_brand_safety_report':
        console.log('Fetching brand safety report:', campaignId);
        response = await fetch(`${baseUrl}/tracking/campaigns/${campaignId}/brand-safety`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'get_fraud_detection_report':
        console.log('Fetching fraud detection report:', campaignId);
        response = await fetch(`${baseUrl}/tracking/campaigns/${campaignId}/fraud-detection`, {
          method: 'GET',
          headers
        });
        result = await response.json();
        break;

      case 'create_custom_report':
        console.log('Creating custom report:', trackingData);
        response = await fetch(`${baseUrl}/tracking/reports/custom`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: trackingData.name,
            campaignIds: trackingData.campaignIds || [],
            metrics: trackingData.metrics || [],
            dimensions: trackingData.dimensions || [],
            filters: trackingData.filters || {},
            dateRange: {
              startDate: dateRange?.startDate,
              endDate: dateRange?.endDate
            },
            schedule: trackingData.schedule || null, // for automated reports
            format: trackingData.format || 'JSON'
          })
        });
        result = await response.json();
        break;

      case 'export_report_data':
        console.log('Exporting report data:', trackingData);
        response = await fetch(`${baseUrl}/tracking/reports/export`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            reportId: trackingData.reportId,
            format: trackingData.format || 'CSV',
            includeCharts: trackingData.includeCharts || false
          })
        });
        result = await response.json();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      console.error('Equativ Tracking API error:', response.status, result);
      throw new Error(`Equativ Tracking API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Equativ tracking operation successful:', action, result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in equativ-tracking:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to execute Equativ tracking operation'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
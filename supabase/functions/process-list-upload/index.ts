import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Set the auth for the client
    supabaseClient.auth.setAuth(authHeader.replace('Bearer ', ''))

    // Get user from auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const listType = formData.get('listType') as string
    const entryType = formData.get('entryType') as string
    const campaignId = formData.get('campaignId') as string

    if (!file) {
      throw new Error('No file provided')
    }

    console.log(`Processing ${file.name} for user ${user.id}`)

    // Read file content
    const fileBuffer = await file.arrayBuffer()
    const fileType = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'xls'
    
    let entries: string[] = []

    if (fileType === 'csv') {
      // Parse CSV
      const csvText = new TextDecoder().decode(fileBuffer)
      const lines = csvText.split('\n').filter(line => line.trim())
      entries = lines.map(line => line.trim().split(',')[0]).filter(entry => entry)
    } else {
      // Parse XLS/XLSX
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
      entries = data.flat().filter(entry => entry && typeof entry === 'string').map(entry => entry.trim())
    }

    console.log(`Found ${entries.length} entries to process`)

    // Create upload record
    const { data: uploadRecord, error: uploadError } = await supabaseClient
      .from('list_uploads')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: fileType,
        list_type: listType,
        entry_type: entryType,
        campaign_id: campaignId || null,
        total_entries: entries.length,
        status: 'pending'
      })
      .select()
      .single()

    if (uploadError) {
      throw new Error(`Failed to create upload record: ${uploadError.message}`)
    }

    console.log(`Created upload record ${uploadRecord.id}`)

    // Process entries in batches
    const batchSize = 100
    let processedCount = 0
    let failedCount = 0

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize)
      const domainListEntries = batch.map(value => ({
        user_id: user.id,
        entry_type: entryType,
        list_type: listType,
        value: value,
        description: `Uploaded from ${file.name}`,
        campaign_id: campaignId || null,
        is_global: !campaignId,
        is_active: true
      }))

      const { error: insertError } = await supabaseClient
        .from('domain_lists')
        .insert(domainListEntries)

      if (insertError) {
        console.error(`Batch insert error:`, insertError)
        failedCount += batch.length
      } else {
        processedCount += batch.length
      }
    }

    // Update upload record with results
    await supabaseClient
      .from('list_uploads')
      .update({
        status: failedCount === 0 ? 'processed' : 'failed',
        processed_entries: processedCount,
        failed_entries: failedCount,
        processed_at: new Date().toISOString(),
        error_message: failedCount > 0 ? `${failedCount} entries failed to process` : null
      })
      .eq('id', uploadRecord.id)

    console.log(`Processing complete: ${processedCount} processed, ${failedCount} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        upload_id: uploadRecord.id,
        processed_entries: processedCount,
        failed_entries: failedCount,
        total_entries: entries.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing upload:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process upload',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
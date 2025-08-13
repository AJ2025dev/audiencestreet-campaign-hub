import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Security limits
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB
const MAX_ENTRIES = 10000;
const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

function estimateBase64Bytes(b64: string) {
  const len = b64.length;
  const padding = (b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0));
  return Math.floor(len * 3 / 4) - padding;
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

    const requestData = await req.json()
    const { file, listType, entryType, campaignId } = requestData

    if (!file || typeof file.name !== 'string' || typeof file.data !== 'string') {
      throw new Error('Invalid file payload')
    }

    // Validate types to prevent abuse
    const typeSafe = /^[a-z_\-]{3,20}$/
    if (!typeSafe.test(listType) || !typeSafe.test(entryType)) {
      throw new Error('Invalid listType or entryType')
    }

    const nameLower = file.name.toLowerCase()
    const dotIdx = nameLower.lastIndexOf('.')
    const ext = dotIdx >= 0 ? nameLower.slice(dotIdx) : ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error('Unsupported file type')
    }

    // Extract base64 data and validate size
    const commaIdx = file.data.indexOf(',')
    const base64Data = commaIdx >= 0 ? file.data.slice(commaIdx + 1) : file.data
    const approxBytes = estimateBase64Bytes(base64Data)
    if (approxBytes > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File too large. Max ${MAX_FILE_SIZE_BYTES} bytes`) 
    }

    console.log(`Processing ${file.name} (${approxBytes} bytes) for user ${user.id}`)

    // Convert to buffer
    const fileBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

    // Determine parsing type
    const fileType = ext === '.csv' ? 'csv' : (ext === '.xlsx' ? 'xlsx' : 'xls')
    
    let entries: string[] = []

    if (fileType === 'csv') {
      // Parse CSV
      const csvText = new TextDecoder().decode(fileBuffer)
      const lines = csvText.split('\n').filter(line => line.trim())
      entries = lines.map(line => line.trim().split(',')[0]).filter(entry => entry)
    } else {
      // Parse XLS/XLSX
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
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
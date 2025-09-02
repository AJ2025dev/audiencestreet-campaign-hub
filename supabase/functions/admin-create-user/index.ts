import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateUserRequest {
  email: string
  role: 'admin' | 'agency' | 'advertiser'
  company_name: string
  contact_email?: string
  phone?: string
  address?: string
  password?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user has admin role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const requestData: CreateUserRequest = await req.json()
    
    // Validate required fields
    if (!requestData.email || !requestData.role || !requestData.company_name) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, role, company_name' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate a temporary password if not provided
    const password = requestData.password || `temp${Math.random().toString(36).slice(-8)}`

    // Step 1: Create auth user using Admin API
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: requestData.email,
      password: password,
      email_confirm: true, // Skip email verification for admin-created users
    })

    if (authError) {
      console.error('Auth user creation error:', authError)
      return new Response(
        JSON.stringify({ 
          error: `Failed to create auth user: ${authError.message}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!authUser.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create auth user' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 2: Create profile with proper user_id reference
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: authUser.user.id,
        role: requestData.role,
        company_name: requestData.company_name,
        contact_email: requestData.contact_email || requestData.email,
        phone: requestData.phone,
        address: requestData.address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // If profile creation fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to create profile: ${profileError.message}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 3: Send password reset email so user can set their own password
    if (!requestData.password) {
      await supabaseAdmin.auth.resetPasswordForEmail(requestData.email, {
        redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/auth/reset-password`
      })
    }

    // Return success response with user data
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
          created_at: authUser.user.created_at,
          profiles: profileData
        },
        message: `User created successfully. ${!requestData.password ? 'Password reset email sent.' : 'Temporary password provided.'}`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: `Internal server error: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, role = "user", company_name, contact_email, phone, address } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: email" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get service role key from environment (try both variable names)
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({ 
          error: "Service role key not configured",
          debug: "Neither SERVICE_ROLE_KEY nor SUPABASE_SERVICE_ROLE_KEY found"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase Admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "https://uzcmjulbpmeythxfusrm.supabase.co";
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: "TempPassword123!", // Temporary password - user will reset via email
      email_confirm: true,
      user_metadata: {
        company_name: company_name || "Unknown",
        role: role,
        contact_email: contact_email || email
      }
    });

    if (authError) {
      console.error("Auth user creation error:", authError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create auth user", 
          details: authError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ 
          error: "No user data returned from auth creation" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create profile record
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        user_id: authData.user.id,
        role: role,
        company_name: company_name || "Unknown",
        contact_email: contact_email || email,
        phone: phone || null,
        address: address || null
      }]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // If profile creation fails, try to clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to create profile", 
          details: profileError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Send password reset email so user can set their own password
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://aj2025dev.github.io/audiencestreet-campaign-hub";
    await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${siteUrl}/reset-password`
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully",
        user_id: authData.user.id,
        email: email,
        company_name: company_name,
        role: role
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

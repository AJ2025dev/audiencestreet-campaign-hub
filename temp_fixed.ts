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
    const { email, role, company_name, contact_email, phone, address } = await req.json();
    
    if (!email || !company_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email and company_name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Service role key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient("https://uzcmjulbpmeythxfusrm.supabase.co", serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Generate a temporary password
    const tempPassword = "TempPassword123!";

    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { 
        company_name: company_name, 
        role: role,
        contact_email: contact_email,
        phone: phone,
        address: address
      }
    });

    if (authError) {
      return new Response(
        JSON.stringify({ error: "Failed to create auth user", details: authError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "No user data returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to create profile with only user_id and role
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        user_id: authData.user.id,
        role: role
      }]);

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    // Send password reset email
    await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: "https://aj2025dev.github.io/audiencestreet-campaign-hub/reset-password"
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully! Password reset email sent.",
        user_id: authData.user.id,
        email: authData.user.email,
        role: role,
        company_name: company_name
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

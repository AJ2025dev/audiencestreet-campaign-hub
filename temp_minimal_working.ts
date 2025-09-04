import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🚀 Function started, method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("✅ CORS preflight handled");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📨 Parsing request body...");
    const body = await req.json();
    console.log("📊 Request body:", JSON.stringify(body, null, 2));
    
    const { email, role, company_name } = body;
    
    console.log("🔍 Extracted fields:", { email, role, company_name });
    
    if (!email) {
      console.log("❌ Missing email");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("🔑 Getting service role key...");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!serviceRoleKey) {
      console.log("❌ No service role key found");
      return new Response(
        JSON.stringify({ error: "Service role key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("✅ Service role key found, length:", serviceRoleKey.length);

    console.log("🔧 Creating Supabase client...");
    const supabaseAdmin = createClient("https://uzcmjulbpmeythxfusrm.supabase.co", serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log("👤 Creating user with email:", email);
    
    // Simple user creation - just email and password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: "TempPassword123!",
      email_confirm: true,
      user_metadata: { 
        company_name: company_name || "Unknown Company",
        role: role || "user"
      }
    });

    if (authError) {
      console.error("❌ Auth creation failed:", authError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create user", 
          details: authError.message,
          code: authError.code,
          debug: "Auth user creation failed"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData?.user) {
      console.log("❌ No user data returned");
      return new Response(
        JSON.stringify({ 
          error: "No user data returned",
          debug: "Auth creation succeeded but no user object returned"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("✅ SUCCESS! User created:", authData.user.id);

    // Return success immediately - no profile creation, no emails
    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully!",
        user_id: authData.user.id,
        email: authData.user.email,
        debug: {
          created_at: authData.user.created_at,
          email_confirmed_at: authData.user.email_confirmed_at,
          role: role,
          company_name: company_name
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("💥 Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        stack: error.stack,
        debug: "Caught in try/catch block"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

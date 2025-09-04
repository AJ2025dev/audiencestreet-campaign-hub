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
    console.log("🔍 Starting debug function...");
    
    // Check environment variables
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "https://uzcmjulbpmeythxfusrm.supabase.co";
    
    console.log("📊 Environment check:");
    console.log("- SUPABASE_URL:", supabaseUrl);
    console.log("- SERVICE_ROLE_KEY exists:", !!serviceRoleKey);
    console.log("- SERVICE_ROLE_KEY length:", serviceRoleKey?.length || 0);
    console.log("- SERVICE_ROLE_KEY starts with:", serviceRoleKey?.substring(0, 10) + "...");

    if (!serviceRoleKey) {
      console.log("❌ SERVICE_ROLE_KEY not found!");
      return new Response(
        JSON.stringify({ 
          error: "Service role key not configured",
          debug: {
            supabaseUrl,
            hasServiceKey: false,
            availableEnvVars: Object.keys(Deno.env.toObject())
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get request body
    const body = await req.json();
    console.log("📨 Request body:", body);

    const { email, password, full_name, role = "user" } = body;

    if (!email || !password || !full_name) {
      console.log("❌ Missing required fields");
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: email, password, full_name",
          received: { email: !!email, password: !!password, full_name: !!full_name }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase Admin client
    console.log("🔧 Creating Supabase Admin client...");
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log("✅ Supabase client created successfully");

    // Test connection with a simple query
    console.log("🧪 Testing database connection...");
    const { data: testData, error: testError } = await supabaseAdmin
      .from("profiles")
      .select("count", { count: "exact" });
    
    if (testError) {
      console.log("❌ Database connection test failed:", testError);
      return new Response(
        JSON.stringify({ 
          error: "Database connection failed", 
          details: testError.message,
          debug: {
            supabaseUrl,
            hasServiceKey: true,
            serviceKeyPrefix: serviceRoleKey.substring(0, 20) + "..."
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("✅ Database connection successful. Profiles count:", testData);

    // Create user in auth.users
    console.log("👤 Creating user in auth.users...");
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name,
        role: role
      }
    });

    if (authError) {
      console.error("❌ Auth user creation error:", authError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create auth user", 
          details: authError.message,
          debug: {
            email,
            authErrorCode: authError.code,
            authErrorMessage: authError.message
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!authData.user) {
      console.log("❌ No user data returned from auth creation");
      return new Response(
        JSON.stringify({ 
          error: "No user data returned from auth creation",
          authData: authData
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("✅ Auth user created successfully:", authData.user.id);

    // Create profile record
    console.log("📝 Creating profile record...");
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        user_id: authData.user.id,
        full_name: full_name,
        role: role,
        email: email
      }]);

    if (profileError) {
      console.error("❌ Profile creation error:", profileError);
      // Clean up auth user
      console.log("🧹 Cleaning up auth user...");
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to create profile", 
          details: profileError.message,
          debug: {
            userId: authData.user.id,
            profileData: {
              user_id: authData.user.id,
              full_name: full_name,
              role: role,
              email: email
            }
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("✅ Profile created successfully");

    // Verify user exists in auth.users
    console.log("🔍 Verifying user in auth.users...");
    const { data: verifyUser, error: verifyError } = await supabaseAdmin.auth.admin.getUserById(authData.user.id);
    
    console.log("✅ User verification result:", {
      exists: !!verifyUser.user,
      email: verifyUser.user?.email,
      id: verifyUser.user?.id
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully with full debugging",
        user_id: authData.user.id,
        email: email,
        full_name: full_name,
        role: role,
        debug: {
          authUserExists: !!verifyUser.user,
          profilesCount: testData,
          timestamp: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("💥 Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        stack: error.stack,
        debug: {
          errorType: error.constructor.name,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
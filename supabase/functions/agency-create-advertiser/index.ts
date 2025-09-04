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
    const { 
      email, 
      password, 
      company_name, 
      full_name, 
      agency_id 
    } = await req.json();

    if (!email || !password || !company_name || !full_name || !agency_id) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: email, password, company_name, full_name, agency_id" 
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

    // Verify agency exists
    const { data: agency, error: agencyError } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("user_id", agency_id)
      .eq("role", "agency")
      .single();

    if (agencyError || !agency) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid agency_id or agency not found" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name,
        company_name: company_name,
        role: "advertiser"
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

    // Create advertiser profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        user_id: authData.user.id,
        full_name: full_name,
        role: "advertiser",
        email: email,
        company_name: company_name
      }]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // If profile creation fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to create advertiser profile", 
          details: profileError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create agency-advertiser relationship
    const { error: relationshipError } = await supabaseAdmin
      .from("agency_advertisers")
      .insert([{
        agency_id: agency_id,
        advertiser_id: authData.user.id
      }]);

    if (relationshipError) {
      console.error("Relationship creation error:", relationshipError);
      // Clean up on error
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to create agency-advertiser relationship", 
          details: relationshipError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Send password reset email
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
        message: "Advertiser created successfully",
        user_id: authData.user.id,
        email: email,
        full_name: full_name,
        company_name: company_name,
        agency_id: agency_id,
        role: "advertiser"
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

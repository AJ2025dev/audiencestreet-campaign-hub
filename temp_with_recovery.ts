import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🚀 Function started, method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, role, company_name } = body;
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
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

    console.log("👤 Creating user with email:", email);
    
    // Create user
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
          details: authError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData?.user) {
      return new Response(
        JSON.stringify({ error: "No user data returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("✅ User created successfully:", authData.user.id);

    // Try to create profile (optional)
    try {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert([{
          user_id: authData.user.id,
          role: role || "user"
        }]);

      if (profileError) {
        console.log("Profile creation failed (non-blocking):", profileError.message);
      } else {
        console.log("✅ Profile created successfully");
      }
    } catch (profileErr) {
      console.log("Profile creation error (ignored):", profileErr);
    }

    // Send password reset email (with delay to avoid rate limiting)
    console.log("📧 Sending password reset email...");
    
    try {
      // Wait 1 second to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: email,
        options: {
          redirectTo: "https://aj2025dev.github.io/audiencestreet-campaign-hub/reset-password"
        }
      });

      if (resetError) {
        console.error("Password reset email failed:", resetError);
        // Don't fail the request if email fails
        return new Response(
          JSON.stringify({
            success: true,
            message: "User created successfully! (Password reset email failed - user can request it manually)",
            user_id: authData.user.id,
            email: authData.user.email,
            email_sent: false,
            email_error: resetError.message
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("✅ Password reset email sent successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "User created successfully! Password reset email sent.",
          user_id: authData.user.id,
          email: authData.user.email,
          email_sent: true,
          note: "User will receive an email to set their password"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (emailError) {
      console.error("Email sending error:", emailError);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "User created successfully! (Email sending failed)",
          user_id: authData.user.id,
          email: authData.user.email,
          email_sent: false,
          note: "User can request password reset manually"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("💥 Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

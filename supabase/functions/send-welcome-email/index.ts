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
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("📧 Sending welcome email to:", email);

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

    // Try different email approaches
    const results = [];

    // Method 1: Password reset email
    try {
      const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: email,
        options: {
          redirectTo: "https://aj2025dev.github.io/audiencestreet-campaign-hub/reset-password"
        }
      });

      results.push({
        method: "password_reset",
        success: !resetError,
        error: resetError?.message || null,
        data: resetData || null
      });

      console.log("Password reset result:", !resetError ? "✅ Success" : "❌ Failed", resetError?.message);
    } catch (e) {
      results.push({
        method: "password_reset",
        success: false,
        error: e.message,
        data: null
      });
    }

    // Method 2: Magic link (alternative)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between requests

      const { data: magicData, error: magicError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: "https://aj2025dev.github.io/audiencestreet-campaign-hub/"
        }
      });

      results.push({
        method: "magic_link",
        success: !magicError,
        error: magicError?.message || null,
        data: magicData || null
      });

      console.log("Magic link result:", !magicError ? "✅ Success" : "❌ Failed", magicError?.message);
    } catch (e) {
      results.push({
        method: "magic_link",
        success: false,
        error: e.message,
        data: null
      });
    }

    const anySuccess = results.some(r => r.success);

    return new Response(
      JSON.stringify({
        success: anySuccess,
        message: anySuccess ? "Email sent successfully!" : "Failed to send email",
        email: email,
        attempts: results,
        debugging: {
          service_role_configured: !!serviceRoleKey,
          supabase_url: "https://uzcmjulbpmeythxfusrm.supabase.co",
          redirect_url: "https://aj2025dev.github.io/audiencestreet-campaign-hub/"
        }
      }),
      { status: anySuccess ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

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
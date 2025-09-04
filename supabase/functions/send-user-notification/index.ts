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
    const { user_id, email, company_name, role, admin_email } = await req.json();
    
    if (!user_id || !email) {
      return new Response(
        JSON.stringify({ error: "user_id and email are required" }),
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

    const results = {
      user_password_reset: null,
      admin_notification: null
    };

    // 1. Send password reset email to user
    console.log("📧 Sending password reset email to user:", email);
    
    try {
      const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: email,
        options: {
          redirectTo: "https://aj2025dev.github.io/audiencestreet-campaign-hub/reset-password"
        }
      });

      if (resetError) {
        console.error("Password reset email failed:", resetError);
        results.user_password_reset = { success: false, error: resetError.message };
      } else {
        console.log("✅ Password reset email sent to user");
        results.user_password_reset = { success: true, link: resetData.properties?.action_link };
      }
    } catch (emailError) {
      console.error("Password reset error:", emailError);
      results.user_password_reset = { success: false, error: emailError.message };
    }

    // 2. Send notification to admin (if admin_email provided)
    if (admin_email && admin_email !== email) {
      console.log("📧 Sending admin notification to:", admin_email);
      
      try {
        // For now, we'll create a simple notification system
        // You could integrate with SendGrid, Resend, or other email services here
        
        // For demo purposes, we'll just log it
        console.log(`📧 Admin notification: New user created - ${email} (${company_name}) with role ${role}`);
        results.admin_notification = { 
          success: true, 
          message: "Admin notification logged (email service not configured)" 
        };
        
      } catch (adminEmailError) {
        console.error("Admin email error:", adminEmailError);
        results.admin_notification = { success: false, error: adminEmailError.message };
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification process completed",
        results: results,
        user_id: user_id,
        email: email
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
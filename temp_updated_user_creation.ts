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
    console.log("📊 Request body:", JSON.stringify(body, null, 2));
    
    const { email, role, company_name, contact_email, phone, address } = body;
    
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
        role: role || "user",
        contact_email: contact_email || email,
        phone: phone || "",
        address: address || ""
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

    // Send notifications
    console.log("📧 Sending notifications...");
    let emailResult = { password_reset_sent: false, error: null };
    
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
        emailResult = { password_reset_sent: false, error: resetError.message };
      } else {
        console.log("✅ Password reset email sent successfully");
        emailResult = { password_reset_sent: true, error: null };
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      emailResult = { password_reset_sent: false, error: emailError.message };
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: emailResult.password_reset_sent 
          ? "User created successfully! Password reset email sent."
          : "User created successfully! (Password reset email failed - user can request it manually)",
        user_id: authData.user.id,
        email: authData.user.email,
        company_name: company_name,
        role: role,
        email_results: emailResult,
        note: emailResult.password_reset_sent 
          ? "User will receive an email to set their password"
          : "User can request password reset manually from the login page"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

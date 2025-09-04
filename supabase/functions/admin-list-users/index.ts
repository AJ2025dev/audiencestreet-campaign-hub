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

    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch users", details: authError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (profileError) {
      console.log("Profile fetch error (non-blocking):", profileError);
    }

    // Combine auth users with profiles
    const combinedUsers = (authUsers.users || []).map(authUser => {
      const profile = profiles?.find(p => p.user_id === authUser.id);
      
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        email_confirmed_at: authUser.email_confirmed_at,
        last_sign_in_at: authUser.last_sign_in_at,
        profiles: profile || {
          id: authUser.id,
          user_id: authUser.id,
          role: authUser.user_metadata?.role || 'user',
          company_name: authUser.user_metadata?.company_name || 'Unknown Company',
          contact_email: authUser.user_metadata?.contact_email || authUser.email,
          phone: authUser.user_metadata?.phone || '',
          address: authUser.user_metadata?.address || '',
          created_at: authUser.created_at,
          updated_at: authUser.updated_at
        }
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        users: combinedUsers,
        total_count: combinedUsers.length
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
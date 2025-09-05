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
    const { action = "preview", new_role = "admin" } = await req.json();

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

    console.log(`🔧 Fix user roles - Action: ${action}, New Role: ${new_role}`);

    // Get all profiles that need fixing
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .neq('role', new_role);

    if (fetchError) {
      console.error("Error fetching profiles:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch profiles", details: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const usersToFix = profiles || [];
    console.log(`📊 Found ${usersToFix.length} users with non-${new_role} roles`);

    if (action === "preview") {
      // Preview mode - just show what would be changed
      return new Response(
        JSON.stringify({
          success: true,
          action: "preview",
          users_to_fix: usersToFix.length,
          users: usersToFix.map(p => ({
            id: p.id,
            user_id: p.user_id,
            company_name: p.company_name,
            current_role: p.role,
            new_role: new_role
          })),
          message: `${usersToFix.length} users would be updated from various roles to '${new_role}'`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "execute") {
      // Execute mode - actually update the roles
      const results = [];
      
      for (const profile of usersToFix) {
        try {
          // Update profile role
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ role: new_role })
            .eq('id', profile.id);

          if (updateError) {
            results.push({
              user_id: profile.user_id,
              company_name: profile.company_name,
              success: false,
              error: updateError.message
            });
          } else {
            results.push({
              user_id: profile.user_id,
              company_name: profile.company_name,
              success: true,
              old_role: profile.role,
              new_role: new_role
            });
          }
        } catch (e) {
          results.push({
            user_id: profile.user_id,
            company_name: profile.company_name,
            success: false,
            error: e.message
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return new Response(
        JSON.stringify({
          success: true,
          action: "execute",
          total_processed: results.length,
          successful_updates: successful,
          failed_updates: failed,
          results: results,
          message: `Updated ${successful} users to '${new_role}' role. ${failed} failed.`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: "Invalid action. Use 'preview' or 'execute'",
        valid_actions: ["preview", "execute"]
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
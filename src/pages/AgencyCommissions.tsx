import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const AgencyCommissions = () => {
  const { user } = useAuth();
  
  const { data: commissions, isLoading, error } = useQuery({
    queryKey: ['agency-commissions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .or(`user_id.eq.${user?.id},applies_to_user_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load commissions', {
        description: error.message
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Agency Commissions</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-pulse">Loading commissions...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Commissions</h1>
          <p className="text-muted-foreground">
            View and manage your commission settings and earnings
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {commissions && commissions.length > 0 ? (
          commissions.map((commission) => (
            <Card key={commission.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Commission Type: {commission.commission_type.replace('_', ' ')}
                  </CardTitle>
                  <Badge variant={commission.is_active ? "default" : "secondary"}>
                    {commission.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  Commission ID: {commission.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Commission Type</p>
                    <p className="font-medium capitalize">{commission.commission_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-medium">{commission.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(commission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="text-2xl mb-4">📊</div>
              <h3 className="text-lg font-medium mb-2">No commissions found</h3>
              <p className="text-muted-foreground">
                You don't have any commission agreements set up yet. 
                Commissions will appear here once they are configured by administrators.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgencyCommissions;
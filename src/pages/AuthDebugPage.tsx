import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthDebugPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Log auth state to console for debugging
    console.log("Auth Debug - User:", user);
    console.log("Auth Debug - Profile:", profile);
    console.log("Auth Debug - Loading:", loading);
    
    setDebugInfo({
      user: user ? "Present" : "Null",
      profile: profile ? "Present" : "Null",
      loading: loading ? "True" : "False",
      userId: user?.id || "N/A",
      userEmail: user?.email || "N/A",
      profileRole: profile?.role || "N/A",
      timestamp: new Date().toISOString()
    });
  }, [user, profile, loading]);

  const handleRefresh = () => {
    refreshProfile();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Authentication Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Auth State</h3>
              <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? "Logged In" : "Not Logged In"}</p>
              <p><strong>Profile:</strong> {profile ? "Loaded" : "Not Loaded"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">User Details</h3>
              <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
              <p><strong>Email:</strong> {user?.email || "N/A"}</p>
              <p><strong>Role:</strong> {profile?.role || "N/A"}</p>
            </div>
          </div>
          
          {debugInfo && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleRefresh}>Refresh Profile</Button>
            <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Auth is currently loading...</p>
            </div>
          )}
          
          {!loading && !user && (
            <div className="text-center py-4">
              <p>You are not logged in. Try logging in first.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
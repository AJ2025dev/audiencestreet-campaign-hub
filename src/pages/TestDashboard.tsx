import React from 'react';
import TestRunner from '@/components/TestRunner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Code, 
  GitBranch, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';

const TestDashboard: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-elegant">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Real-Time Test Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Comprehensive testing of GitHub changes and platform functionality
            </p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <GitBranch className="h-4 w-4" />
            GitHub Integration Active
          </Badge>
        </div>

        {/* User Info Card */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-5 w-5" />
              Current Test User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || 'Not authenticated'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline" className="capitalize">
                  {profile?.role || 'Unknown'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{profile?.company_name || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Authentication</p>
                  <p className="text-xl font-bold text-foreground">
                    {user ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Code className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">GitHub Changes</p>
                  <p className="text-xl font-bold text-foreground">Deployed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Test Coverage</p>
                  <p className="text-xl font-bold text-foreground">7 Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-bold text-foreground">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Test Runner */}
        <TestRunner />

        {/* Test Documentation */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>End-to-End Test Scenarios Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Advertiser Management</h4>
                  <p className="text-sm text-muted-foreground">Create and manage advertiser accounts</p>
                </div>
                <StatusBadge status="partial" text="Mock Data Only" />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Campaign Creation & Persistence</h4>
                  <p className="text-sm text-muted-foreground">Launch campaigns and verify data persistence</p>
                </div>
                <StatusBadge status="partial" text="UI Complete, No DB" />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Domain Lists Management</h4>
                  <p className="text-sm text-muted-foreground">Add/edit domain allowlist entries</p>
                </div>
                <StatusBadge status="working" text="Fully Functional" />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Dynamic Dashboard Stats</h4>
                  <p className="text-sm text-muted-foreground">Aggregated metrics from real campaign data</p>
                </div>
                <StatusBadge status="partial" text="Static Mock Data" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Documentation */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h4>Current Implementation Status:</h4>
              <ul>
                <li><strong>✅ Working:</strong> Authentication, Domain Lists, Real-time features, GitHub changes</li>
                <li><strong>⚠️ Partial:</strong> Advertisers (UI only), Campaigns (UI only), Dashboard (static data)</li>
                <li><strong>❌ Missing:</strong> Supabase integration for Advertisers and Campaigns CRUD</li>
              </ul>
              
              <h4>To Complete Full E2E Testing:</h4>
              <ol>
                <li><strong>Connect Advertisers to Database:</strong> Replace mock data with Supabase queries</li>
                <li><strong>Connect Campaigns to Database:</strong> Implement full campaign CRUD operations</li>
                <li><strong>Make Dashboard Dynamic:</strong> Calculate metrics from real campaign data</li>
              </ol>
              
              <h4>Test Execution:</h4>
              <ul>
                <li>🔧 Use <strong>Test Dashboard</strong> for automated validation</li>
                <li>📊 Navigate to specific pages to test individual features</li>
                <li>🔍 Check browser console for detailed test logging</li>
                <li>📋 Review <code>IMPLEMENTATION_STATUS.md</code> for detailed status</li>
              </ul>

              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">
                  <strong>Ready to Test Now:</strong> Domain Lists Management (fully functional E2E scenario)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestDashboard;
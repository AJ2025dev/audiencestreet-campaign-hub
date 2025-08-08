import React from 'react';
import TestRunner from '@/components/TestRunner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
            <CardTitle>Test Case Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h4>GitHub Changes Being Tested:</h4>
              <ul>
                <li>Enhanced error logging in authentication flow</li>
                <li>Improved console error reporting</li>
                <li>Better error message formatting for users</li>
                <li>Real-time deployment verification</li>
              </ul>
              
              <h4>Test Categories:</h4>
              <ul>
                <li><strong>Authentication:</strong> User login, profile loading, session management</li>
                <li><strong>Dashboard:</strong> Metrics display, chart rendering, data visualization</li>
                <li><strong>API:</strong> Database connections, Supabase integration</li>
                <li><strong>Real-time:</strong> WebSocket connections, live updates</li>
                <li><strong>Security:</strong> Role-based permissions, access control</li>
              </ul>

              <h4>How to Use:</h4>
              <ol>
                <li>Click "Run All Tests" to execute the complete test suite</li>
                <li>Monitor the browser console for detailed test logs</li>
                <li>Individual tests can be run by clicking "Run" next to each test</li>
                <li>Test results are displayed with status icons and timing information</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestDashboard;
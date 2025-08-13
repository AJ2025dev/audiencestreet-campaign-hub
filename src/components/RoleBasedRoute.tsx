import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface RoleBasedRouteProps {
  children: React.ReactNode;
}

export function RoleBasedRoute({ children }: RoleBasedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect based on user role to their specific dashboard
      const currentPath = window.location.pathname;
      
      if (currentPath === '/' || currentPath === '/dashboard') {
        switch (profile.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'agency':
            navigate('/agency');
            break;
          case 'advertiser':
            navigate('/advertiser');
            break;
          default:
            // Stay on current route
            break;
        }
      }
    }
  }, [loading, user, profile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
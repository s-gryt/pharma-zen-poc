import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { LoadingSpinner } from '@/shared/components/ui';

/**
 * Protected route props interface
 */
interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly requiredRole?: 'admin' | 'customer';
  readonly fallbackPath?: string;
}

/**
 * Protected route component
 * 
 * Wraps routes that require authentication and/or specific roles.
 * Redirects unauthenticated users to login page with return path.
 * Shows access denied for users with insufficient permissions.
 * 
 * Features:
 * - Authentication requirement enforcement
 * - Role-based access control  
 * - Automatic redirect to login with return path
 * - Loading state during auth check
 * - Preserve intended destination in location state
 * - Configurable fallback paths for unauthorized access
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Check role-based access if required role is specified
  if (requiredRole && user.role !== requiredRole) {
    // Use custom fallback path or default based on user role
    const redirectPath = fallbackPath || (user.role === 'admin' ? '/admin' : '/');
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
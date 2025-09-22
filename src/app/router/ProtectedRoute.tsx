import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import type { UserRole } from '../providers/types';

/**
 * Protected route component props
 */
interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly requiredRole?: UserRole;
}

/**
 * Protected route wrapper component
 * 
 * Handles:
 * - Authentication requirement
 * - Role-based access control
 * - Redirect to login with return path
 * - Unauthorized access handling
 * 
 * @param props - Component props
 * @returns Protected route component or redirect
 * 
 * @example
 * ```tsx
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check role-based access if required role is specified
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to appropriate default page based on user role
    const redirectPath = user?.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
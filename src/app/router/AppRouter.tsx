import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

// Lazy load pages for code splitting
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const HomePage = React.lazy(() => import('@/pages/customer/HomePage'));
const ProductsPage = React.lazy(() => import('@/pages/customer/ProductsPage'));
const CartPage = React.lazy(() => import('@/pages/customer/CartPage'));
const CheckoutPage = React.lazy(() => import('@/pages/customer/CheckoutPage'));
const AdminDashboardPage = React.lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductsPage = React.lazy(() => import('@/pages/admin/ProductsPage'));
const AdminOrdersPage = React.lazy(() => import('@/pages/admin/OrdersPage'));
const NotFoundPage = React.lazy(() => import('@/pages/common/NotFoundPage'));

/**
 * Main application router component
 * 
 * Features:
 * - Role-based route protection
 * - Lazy loading for code splitting
 * - Loading states during authentication
 * - Fallback routes for unauthorized access
 * 
 * Route Structure:
 * - /login - Authentication page
 * - / - Customer home page (protected)
 * - /products - Product catalog (protected)  
 * - /cart - Shopping cart (protected)
 * - /checkout - Checkout process (protected)
 * - /admin/* - Admin routes (admin-only)
 */
export const AppRouter: React.FC = () => {
  const { loading, isAuthenticated, user } = useAuth();

  // Show loading spinner during authentication check
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <React.Suspense 
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="medium" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace /> : 
              <LoginPage />
          } 
        />

        {/* Protected Customer Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="customer">
              <HomePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/products"
          element={
            <ProtectedRoute requiredRole="customer">
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/cart"
          element={
            <ProtectedRoute requiredRole="customer">
              <CartPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRole="customer">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </React.Suspense>
  );
};
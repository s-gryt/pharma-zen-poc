import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Alert, Button } from '@mui/material';
import { 
  TrendingUp, 
  Inventory, 
  ShoppingCart, 
  People,
  AttachMoney,
  LocalShipping,
} from '@mui/icons-material';
import { AdminLayout } from '../components/AdminLayout';
import { MetricCard } from '../components/MetricCard';
import { mockProductsApi, mockOrdersApi, Product, Order } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

/**
 * Admin dashboard page component
 * 
 * Features:
 * - Key metrics overview
 * - Recent activity summary
 * - Quick action buttons
 * - Performance indicators
 */
const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard data...');

        const [productsResponse, ordersResponse] = await Promise.all([
          mockProductsApi.getProducts(),
          mockOrdersApi.getAllOrders(),
        ]);

        console.log('Dashboard data fetched successfully');
        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        console.error('Failed to fetch dashboard data:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate metrics
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const lowStockProducts = products?.filter(product => product.stockQuantity < 10).length || 0;

  if (loading) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" className="py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </Container>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" className="py-8">
          <Alert severity="error" className="mb-4">
            Failed to load dashboard: {error}
          </Alert>
          <Button onClick={() => window.location.reload()} variant="contained">
            Retry
          </Button>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" className="py-8">
        <div className="mb-8">
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Here's what's happening with your store today.
          </Typography>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(totalRevenue)}
            subtitle="All time"
            icon={<AttachMoney />}
            color="success"
            trend={{ value: 12.5, isPositive: true }}
          />
          
          <MetricCard
            title="Total Orders"
            value={totalOrders}
            subtitle={`${pendingOrders} pending`}
            icon={<ShoppingCart />}
            color="primary"
            trend={{ value: 8.2, isPositive: true }}
          />
          
          <MetricCard
            title="Products"
            value={totalProducts}
            subtitle={`${lowStockProducts} low stock`}
            icon={<Inventory />}
            color="secondary"
          />
          
          <MetricCard
            title="Growth"
            value="+24%"
            subtitle="vs last month"
            icon={<TrendingUp />}
            color="success"
            trend={{ value: 4.1, isPositive: true }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Paper className="p-6">
            <Typography variant="h6" gutterBottom>
              Order Status Overview
            </Typography>
            <div className="space-y-3">
              {[
                { status: 'Pending', count: pendingOrders, color: 'warning' },
                { status: 'Confirmed', count: Math.floor(totalOrders * 0.3), color: 'info' },
                { status: 'Shipped', count: Math.floor(totalOrders * 0.4), color: 'primary' },
                { status: 'Delivered', count: Math.floor(totalOrders * 0.25), color: 'success' },
              ].map((item) => (
                <div key={item.status} className="flex justify-between items-center">
                  <Typography variant="body2">{item.status}</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {item.count}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>

          <Paper className="p-6">
            <Typography variant="h6" gutterBottom>
              Product Categories
            </Typography>
            <div className="space-y-3">
              {[
                { category: 'Pharmacy', count: products?.filter(p => p.category === 'pharmacy').length || 0 },
                { category: 'Health & Wellness', count: products?.filter(p => p.category === 'health').length || 0 },
                { category: 'Personal Care', count: products?.filter(p => p.category === 'personal-care').length || 0 },
              ].map((item) => (
                <div key={item.category} className="flex justify-between items-center">
                  <Typography variant="body2">{item.category}</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {item.count} products
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>
        </div>

        {/* Alerts */}
        {lowStockProducts > 0 && (
          <Paper className="p-6 border-l-4 border-warning-main bg-warning-50">
            <Typography variant="h6" color="warning.dark" gutterBottom>
              Low Stock Alert
            </Typography>
            <Typography variant="body2" color="warning.dark">
              {lowStockProducts} product{lowStockProducts !== 1 ? 's' : ''} running low on stock. 
              Consider restocking soon to avoid stockouts.
            </Typography>
          </Paper>
        )}
      </Container>
    </AdminLayout>
  );
};

export default DashboardPage;
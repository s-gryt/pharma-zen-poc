import React from 'react';
import { Container, Typography } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';

/**
 * Admin orders management page component (placeholder for Phase 5)
 */
const OrdersPage: React.FC = () => {
  return (
    <AdminLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Order Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Order management functionality will be implemented in Phase 5
        </Typography>
      </Container>
    </AdminLayout>
  );
};

export default OrdersPage;
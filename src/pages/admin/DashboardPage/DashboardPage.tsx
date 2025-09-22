import React from 'react';
import { Container, Typography } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';

/**
 * Admin dashboard page component
 */
const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Dashboard metrics and overview will be implemented in Phase 5
        </Typography>
      </Container>
    </AdminLayout>
  );
};

export default DashboardPage;
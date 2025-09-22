import React from 'react';
import { Container, Typography } from '@mui/material';
import { AdminLayout } from '../components/AdminLayout';

/**
 * Admin products management page component (placeholder for Phase 5)
 */
const ProductsPage: React.FC = () => {
  return (
    <AdminLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Product Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Product CRUD operations will be implemented in Phase 5
        </Typography>
      </Container>
    </AdminLayout>
  );
};

export default ProductsPage;
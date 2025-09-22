import React from 'react';
import { Container, Typography } from '@mui/material';
import { CustomerLayout } from '../components/CustomerLayout';

/**
 * Products page component (placeholder for Phase 2)
 */
const ProductsPage: React.FC = () => {
  return (
    <CustomerLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Product catalog will be implemented in Phase 2
        </Typography>
      </Container>
    </CustomerLayout>
  );
};

export default ProductsPage;
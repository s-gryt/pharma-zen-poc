import React from 'react';
import { Container, Typography } from '@mui/material';
import { CustomerLayout } from '../components/CustomerLayout';

/**
 * Shopping cart page component (placeholder for Phase 4)
 */
const CartPage: React.FC = () => {
  return (
    <CustomerLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Shopping cart functionality will be implemented in Phase 4
        </Typography>
      </Container>
    </CustomerLayout>
  );
};

export default CartPage;
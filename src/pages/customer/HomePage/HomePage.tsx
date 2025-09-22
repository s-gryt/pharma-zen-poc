import React from 'react';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LocalPharmacy, HealthAndSafety, Person } from '@mui/icons-material';
import { CustomerLayout } from '../components/CustomerLayout';

/**
 * Customer home page component
 * 
 * Features:
 * - Welcome message with user context
 * - Quick navigation to main features
 * - Category overview cards
 * - Recent activity (future enhancement)
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Pharmacy',
      description: 'Prescription medications and health consultations',
      icon: <LocalPharmacy fontSize="large" />,
      path: '/products?category=pharmacy',
    },
    {
      title: 'Health & Wellness',
      description: 'Vitamins, supplements, and health monitoring',
      icon: <HealthAndSafety fontSize="large" />,
      path: '/products?category=health',
    },
    {
      title: 'Personal Care',
      description: 'Beauty products, skincare, and daily essentials',
      icon: <Person fontSize="large" />,
      path: '/products?category=personal-care',
    },
  ];

  return (
    <CustomerLayout>
      <Container maxWidth="lg" className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Walgreens
          </Typography>
          <Typography variant="h6" color="textSecondary" className="mb-6">
            Your trusted partner in health and wellness
          </Typography>
          <div className="space-x-4">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              className="mr-4"
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/cart')}
            >
              View Cart
            </Button>
          </div>
        </div>

        {/* Categories Section */}
        <Typography variant="h4" component="h2" className="mb-6 text-center">
          Shop by Category
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <div key={category.title}>
              <Card 
                className="h-full cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate(category.path)}
              >
                <CardContent className="text-center p-6">
                  <div className="mb-4 text-primary">
                    {category.icon}
                  </div>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-4">
                    {category.description}
                  </Typography>
                  <Button variant="outlined">
                    Browse {category.title}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <Card className="bg-secondary">
          <CardContent className="text-center p-8">
            <Typography variant="h4" component="h2" className="mb-4">
              Why Choose Walgreens?
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Typography variant="h6" gutterBottom>
                  Trusted Quality
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Over 100 years of healthcare expertise and trusted products
                </Typography>
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Convenient Shopping
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Easy online ordering with in-store pickup and delivery options
                </Typography>
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Expert Care
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Professional pharmacists and healthcare consultations
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </CustomerLayout>
  );
};

export default HomePage;
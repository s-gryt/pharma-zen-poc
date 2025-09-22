import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Pill, Heart, User } from 'lucide-react';
import { CustomerLayout } from '../components/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      icon: <Pill className="w-12 h-12" />,
      path: '/products?category=pharmacy',
    },
    {
      title: 'Health & Wellness',
      description: 'Vitamins, supplements, and health monitoring',
      icon: <Heart className="w-12 h-12" />,
      path: '/products?category=health',
    },
    {
      title: 'Personal Care',
      description: 'Beauty products, skincare, and daily essentials',
      icon: <User className="w-12 h-12" />,
      path: '/products?category=personal-care',
    },
  ];

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-walgreens-red">
            Welcome to Walgreens
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your trusted partner in health and wellness
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/products')}
              className="bg-walgreens-red hover:bg-walgreens-red/90"
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/cart')}
              className="border-walgreens-red text-walgreens-red hover:bg-walgreens-red hover:text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart
            </Button>
          </div>
        </div>

        {/* Categories Section */}
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <Card 
              key={category.title}
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-walgreens-blue/20"
              onClick={() => navigate(category.path)}
            >
              <CardContent className="text-center p-8">
                <div className="mb-6 text-walgreens-red flex justify-center">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-walgreens-blue">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {category.description}
                </p>
                <Button 
                  variant="outline"
                  className="border-walgreens-blue text-walgreens-blue hover:bg-walgreens-blue hover:text-white"
                >
                  Browse {category.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <Card className="bg-gradient-to-r from-walgreens-light-blue to-walgreens-teal">
          <CardContent className="text-center p-12">
            <h2 className="text-3xl font-bold mb-8 text-walgreens-blue">
              Why Choose Walgreens?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-walgreens-blue">
                  Trusted Quality
                </h3>
                <p className="text-muted-foreground">
                  Over 100 years of healthcare expertise and trusted products
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-walgreens-blue">
                  Convenient Shopping
                </h3>
                <p className="text-muted-foreground">
                  Easy online ordering with in-store pickup and delivery options
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-walgreens-blue">
                  Expert Care
                </h3>
                <p className="text-muted-foreground">
                  Professional pharmacists and healthcare consultations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default HomePage;
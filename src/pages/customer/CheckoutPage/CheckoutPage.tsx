import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CustomerLayout } from '../components/CustomerLayout';
import { useCart } from '@/app/providers/CartProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { mockOrdersApi, Address } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Checkout page component
 * 
 * Features:
 * - Order summary display
 * - Shipping address form
 * - Payment information form (mock)
 * - Order placement
 * - Form validation
 */
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof Address)[] = ['street', 'city', 'state', 'zipCode'];
    
    for (const field of requiredFields) {
      if (!shippingAddress[field].trim()) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await mockOrdersApi.createOrder({
        cartId: cart.id,
        shippingAddress,
      });

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/', { 
        state: { 
          orderConfirmation: {
            orderId: response.data.id,
            total: response.data.totalAmount,
          }
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <Container maxWidth="lg" className="py-8">
          <Alert severity="warning" className="mb-4">
            Your cart is empty. Please add items before checkout.
          </Alert>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </Container>
      </CustomerLayout>
    );
  }

  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <CustomerLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                
                <div className="grid grid-cols-1 gap-4">
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      required
                    />
                    
                    <FormControl fullWidth required>
                      <InputLabel>State</InputLabel>
                      <Select
                        value={shippingAddress.state}
                        label="State"
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                      >
                        <MenuItem value="CA">California</MenuItem>
                        <MenuItem value="NY">New York</MenuItem>
                        <MenuItem value="TX">Texas</MenuItem>
                        <MenuItem value="FL">Florida</MenuItem>
                        <MenuItem value="IL">Illinois</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                
                <Alert severity="info" className="mb-4">
                  This is a demo checkout. No real payment will be processed.
                </Alert>
                
                <div className="grid grid-cols-1 gap-4">
                  <TextField
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    disabled
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Expiration Date"
                      placeholder="MM/YY"
                      disabled
                    />
                    
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <Typography variant="body2" fontWeight="medium">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </Typography>
                      </div>
                      <Typography variant="body2" fontWeight="medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </Typography>
                    </div>
                  ))}
                </div>

                <Divider className="mb-4" />

                {/* Pricing Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">
                      {formatPrice(subtotal)}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between">
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2" color="success.main">
                      FREE
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between">
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">
                      {formatPrice(tax)}
                    </Typography>
                  </div>
                </div>

                <Divider className="mb-4" />

                <div className="flex justify-between mb-6">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(total)}
                  </Typography>
                </div>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="mb-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/cart')}
                  disabled={loading}
                >
                  Back to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </CustomerLayout>
  );
};

export default CheckoutPage;
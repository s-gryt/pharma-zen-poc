import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCartOutlined } from '@mui/icons-material';
import { CustomerLayout } from '../components/CustomerLayout';
import { useCart } from '@/app/providers/CartProvider';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

/**
 * Shopping cart page component
 * 
 * Features:
 * - Display cart items with product details
 * - Quantity management (increase/decrease)
 * - Remove items from cart
 * - Cart total calculation
 * - Empty cart state
 * - Proceed to checkout
 */
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, removeFromCart, addToCart } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleIncreaseQuantity = async (productId: string) => {
    const item = cart?.items.find(item => item.productId === productId);
    if (item) {
      await addToCart(item.product, 1);
    }
  };

  const handleDecreaseQuantity = async (productId: string) => {
    const item = cart?.items.find(item => item.productId === productId);
    if (item && item.quantity > 1) {
      // Remove one item (simulated by removing the item and adding back with quantity - 1)
      await removeFromCart(item.id);
      if (item.quantity > 1) {
        await addToCart(item.product, item.quantity - 1);
      }
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <Container maxWidth="lg" className="py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </Container>
      </CustomerLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <Container maxWidth="lg" className="py-8">
          <Paper className="p-8 text-center">
            <ShoppingCartOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Start shopping to add items to your cart
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </Paper>
        </Container>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        
        <Typography variant="body2" color="textSecondary" className="mb-6">
          {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <img
                      src={item.product.imageUrl || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <Typography variant="h6" className="mb-1">
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        {item.product.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(item.product.price)}
                      </Typography>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <IconButton
                        size="small"
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        disabled={item.quantity <= 1 || loading}
                      >
                        <Remove />
                      </IconButton>
                      <Typography variant="body1" className="min-w-[2rem] text-center">
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleIncreaseQuantity(item.productId)}
                        disabled={loading}
                      >
                        <Add />
                      </IconButton>
                    </div>

                    {/* Remove Button */}
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-end mt-4">
                    <Typography variant="body1" fontWeight="medium">
                      Subtotal: {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <Typography variant="body2">
                      Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice(cart.totalAmount)}
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
                      {formatPrice(cart.totalAmount * 0.08)}
                    </Typography>
                  </div>
                </div>

                <Divider className="mb-4" />

                <div className="flex justify-between mb-4">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(cart.totalAmount * 1.08)}
                  </Typography>
                </div>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  className="mb-2"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </CustomerLayout>
  );
};

export default CartPage;
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Chip } from '@mui/material';
import { ShoppingCart, CheckCircle } from '@mui/icons-material';
import { Product } from '@/shared/lib/api';
import { useCart } from '@/app/providers/CartProvider';

/**
 * Product card props
 */
interface ProductCardProps {
  readonly product: Product;
  readonly onViewDetails?: (product: Product) => void;
}

/**
 * Product card component
 * 
 * Displays product information in a card format with add to cart functionality
 */
export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails 
}) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    await addToCart(product, 1);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pharmacy':
        return 'primary';
      case 'health':
        return 'success';
      case 'personal-care':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'pharmacy':
        return 'Pharmacy';
      case 'health':
        return 'Health & Wellness';
      case 'personal-care':
        return 'Personal Care';
      default:
        return category;
    }
  };

  return (
    <Card className="h-full flex flex-col transition-transform hover:scale-105">
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || '/placeholder.svg'}
        alt={product.name}
        className="h-48 object-cover cursor-pointer"
        onClick={() => onViewDetails?.(product)}
      />
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="mb-2">
          <Chip
            label={getCategoryLabel(product.category)}
            color={getCategoryColor(product.category) as any}
            size="small"
            className="mb-2"
          />
        </div>

        <Typography
          variant="h6"
          component="h3"
          className="mb-2 cursor-pointer hover:text-primary"
          onClick={() => onViewDetails?.(product)}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          className="mb-3 flex-1"
        >
          {product.description}
        </Typography>

        <div className="flex items-center justify-between mb-3">
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
          
          <div className="flex items-center">
            {product.inStock ? (
              <>
                <CheckCircle color="success" fontSize="small" className="mr-1" />
                <Typography variant="body2" color="success.main">
                  In Stock ({product.stockQuantity})
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="error">
                Out of Stock
              </Typography>
            )}
          </div>
        </div>

        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={!product.inStock || loading}
          fullWidth
          className="mt-auto"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};
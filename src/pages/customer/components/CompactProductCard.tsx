import React from 'react';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { ShoppingCart, CheckCircle } from '@mui/icons-material';
import { Product } from '@/shared/lib/api';
import { useCart } from '@/app/providers/CartProvider';

/**
 * Compact product card props
 */
interface CompactProductCardProps {
  readonly product: Product;
  readonly onViewDetails?: (product: Product) => void;
}

/**
 * Compact product card component
 * 
 * Displays product information in a compact card format optimized for grid layouts
 */
export const CompactProductCard: React.FC<CompactProductCardProps> = ({ 
  product, 
  onViewDetails 
}) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product, 1);
    } finally {
      setLoading(false);
    }
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
    <Card className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 border border-border">
      {/* Product Image */}
      <div 
        className="relative h-32 bg-muted cursor-pointer overflow-hidden"
        onClick={() => onViewDetails?.(product)}
      >
        <img
          src={product.imageUrl || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Chip
            label={getCategoryLabel(product.category)}
            color={getCategoryColor(product.category) as any}
            size="small"
            className="text-xs"
          />
        </div>
      </div>
      
      <CardContent className="flex-1 flex flex-col p-3 space-y-2">
        {/* Product Name */}
        <Typography
          variant="body2"
          component="h3"
          className="font-semibold cursor-pointer hover:text-primary line-clamp-2 min-h-[2.5rem]"
          onClick={() => onViewDetails?.(product)}
        >
          {product.name}
        </Typography>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <Typography variant="h6" color="primary" className="font-bold text-sm">
            {formatPrice(product.price)}
          </Typography>
          
          <div className="flex items-center">
            {product.inStock ? (
              <div className="flex items-center">
                <CheckCircle color="success" sx={{ fontSize: 14 }} className="mr-1" />
                <Typography variant="caption" color="success.main">
                  ({product.stockQuantity})
                </Typography>
              </div>
            ) : (
              <Typography variant="caption" color="error">
                Out of Stock
              </Typography>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          size="small"
          startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
          onClick={handleAddToCart}
          disabled={!product.inStock || loading}
          fullWidth
          className="mt-auto text-xs py-1"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};
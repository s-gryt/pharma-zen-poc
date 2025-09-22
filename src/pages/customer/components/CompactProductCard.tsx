import React from 'react';
import { Product } from '@/shared/lib/api';
import { useCart } from '@/app/providers/CartProvider';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Compact product card props
 */
interface CompactProductCardProps {
  readonly product: Product;
  readonly onViewDetails: (product: Product) => void;
  readonly viewMode?: 'grid' | 'list';
}

/**
 * Compact product card component optimized for grid display
 * 
 * Features:
 * - Minimal, clean design
 * - Essential product information
 * - Quick add to cart functionality
 * - Responsive layout
 * - Hover effects for interactivity
 */
export const CompactProductCard: React.FC<CompactProductCardProps> = ({ 
  product, 
  onViewDetails,
  viewMode = 'grid'
}) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product);
  };

  const handleCardClick = () => {
    onViewDetails(product);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer transition-all hover:shadow-md border-walgreens-blue/20"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="w-20 h-20 bg-gradient-to-br from-walgreens-light-blue to-walgreens-teal rounded-lg flex items-center justify-center text-walgreens-blue font-bold text-sm flex-shrink-0">
              {product.name.charAt(0)}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-walgreens-blue truncate text-sm">
                  {product.name}
                </h3>
                <Badge 
                  variant={product.inStock ? "default" : "secondary"}
                  className={product.inStock ? "bg-walgreens-teal text-white" : "bg-gray-200 text-gray-600"}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-walgreens-red">
                    {formatPrice(product.price)}
                  </span>
                  {/* Remove reviews since not in Product type */}
                </div>

                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || loading}
                  className="bg-walgreens-red hover:bg-walgreens-red/90 text-white px-3 py-1 h-8"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-walgreens-blue/20 group"
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-walgreens-light-blue to-walgreens-teal rounded-lg mb-3 flex items-center justify-center text-walgreens-blue font-bold text-lg group-hover:scale-105 transition-transform">
          {product.name.charAt(0)}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-walgreens-blue text-sm mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
          {product.name}
        </h3>

        {/* Price and Rating */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-walgreens-red text-lg">
              {formatPrice(product.price)}
            </span>
            <Badge 
              variant={product.inStock ? "default" : "secondary"}
              className={`text-xs ${product.inStock ? "bg-walgreens-teal text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {product.inStock ? 'Stock' : 'Out'}
            </Badge>
          </div>
          
          {/* Remove reviews since not in Product type */}
        </div>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!product.inStock || loading}
          className="w-full bg-walgreens-red hover:bg-walgreens-red/90 text-white h-8 text-xs"
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Alert } from '@mui/material';
import { CustomerLayout } from '../components/CustomerLayout';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { useApi } from '@/shared/hooks/useApi';
import { mockProductsApi, Product, ProductCategory } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

/**
 * Products page component
 * 
 * Features:
 * - Product catalog with grid display
 * - Search and category filtering
 * - Add to cart functionality
 * - Loading states and error handling
 */
const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products with filters
  const {
    data: products,
    loading,
    error,
    execute: refetchProducts
  } = useApi(
    () => mockProductsApi.getProducts({
      category: selectedCategory || undefined,
      search: debouncedSearch || undefined,
    }),
    { immediate: true }
  );

  // Refetch when filters change
  useEffect(() => {
    refetchProducts();
  }, [selectedCategory, debouncedSearch, refetchProducts]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleViewDetails = (product: Product) => {
    // TODO: Implement product detail modal or page
    console.log('View product details:', product);
  };

  if (error) {
    return (
      <CustomerLayout>
        <Container maxWidth="lg" className="py-8">
          <Alert severity="error" className="mb-4">
            Failed to load products: {error}
          </Alert>
          <Button onClick={refetchProducts} variant="contained">
            Try Again
          </Button>
        </Container>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Our Products
        </Typography>
        
        <Typography variant="body1" color="textSecondary" className="mb-6">
          Discover our wide range of health and wellness products
        </Typography>

        <ProductFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        ) : (
          <Paper className="p-8 text-center">
            <Typography variant="h6" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Try adjusting your search or filter criteria
            </Typography>
            <Button onClick={handleClearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Paper>
        )}
      </Container>
    </CustomerLayout>
  );
};

export default ProductsPage;
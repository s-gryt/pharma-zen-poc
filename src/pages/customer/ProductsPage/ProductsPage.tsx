import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ShoppingCart, Pill, Heart, User } from 'lucide-react';
import { CustomerLayout } from '../components/CustomerLayout';
import { CompactProductCard } from '../components/CompactProductCard';
import { mockProductsApi, Product, ProductCategory } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price-low' | 'price-high';

/**
 * Products page component - Main landing page
 * 
 * Features:
 * - Hero section with welcome message and CTAs
 * - Category cards for quick navigation
 * - Unified product catalog with all products
 * - Advanced search and filtering
 * - Grid/List view toggle
 * - Sorting options
 * - Category filtering
 * - Loading states and error handling
 */
const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    const searchParam = searchParams.get('search') || '';
    
    if (categoryParam && ['pharmacy', 'health', 'personal-care'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products without filtering (we'll filter client-side for better UX)
      const response = await mockProductsApi.getProducts();
      setProducts(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      console.error('Failed to fetch products:', err);
      setError(errorMessage);
      setProducts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort products
  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, debouncedSearch, sortBy]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSearchParams({});
  };

  const handleViewDetails = (product: Product) => {
    // TODO: Implement product detail modal or page
    console.log('View product details:', product);
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0);

  const categories = [
    {
      title: 'Pharmacy',
      description: 'Prescription medications and health consultations',
      icon: <Pill className="w-12 h-12" />,
      category: 'pharmacy' as ProductCategory,
    },
    {
      title: 'Health & Wellness',
      description: 'Vitamins, supplements, and health monitoring',
      icon: <Heart className="w-12 h-12" />,
      category: 'health' as ProductCategory,
    },
    {
      title: 'Personal Care',
      description: 'Beauty products, skincare, and daily essentials',
      icon: <User className="w-12 h-12" />,
      category: 'personal-care' as ProductCategory,
    },
  ];

  const handleCategoryClick = (category: ProductCategory) => {
    setSelectedCategory(category);
    setSearchParams({ category });
    // Scroll to products section
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (error) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Failed to load products: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={fetchProducts}>
            Try Again
          </Button>
        </div>
      </CustomerLayout>
    );
  }

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
              onClick={() => {
                // Scroll to products section
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
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
              onClick={() => handleCategoryClick(category.category)}
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

        {/* Products Section */}
        <div id="products-section" className="scroll-mt-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 text-walgreens-red">Our Products</h2>
            <p className="text-muted-foreground text-lg">
              Discover our wide range of health and wellness products
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 border-walgreens-blue/20">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-walgreens-blue/30 focus:border-walgreens-red"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={(value: ProductCategory | 'all') => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full lg:w-48 border-walgreens-blue/30">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="personal-care">Personal Care</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-full lg:w-48 border-walgreens-blue/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price Low-High</SelectItem>
                  <SelectItem value="price-high">Price High-Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-walgreens-red hover:bg-walgreens-red/90' : 'border-walgreens-blue/30 text-walgreens-blue hover:bg-walgreens-red hover:text-white'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-walgreens-red hover:bg-walgreens-red/90' : 'border-walgreens-blue/30 text-walgreens-blue hover:bg-walgreens-red hover:text-white'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                
                {searchTerm && (
                  <Badge variant="secondary" className="bg-walgreens-light-blue text-walgreens-blue">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 hover:text-walgreens-red"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="bg-walgreens-light-blue text-walgreens-blue">
                    Category: {selectedCategory === 'health' ? 'Health & Wellness' : selectedCategory === 'personal-care' ? 'Personal Care' : 'Pharmacy'}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 hover:text-walgreens-red"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-walgreens-red hover:bg-walgreens-red hover:text-white"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {products && filteredProducts.length !== products.length && ` of ${products.length} total`}
              </p>
            </div>
            
            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                : "space-y-4"
            }>
              {filteredProducts.map((product) => (
                <CompactProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center border-walgreens-blue/20">
            <h3 className="text-xl font-semibold mb-3 text-walgreens-blue">
              No products found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="border-walgreens-red text-walgreens-red hover:bg-walgreens-red hover:text-white"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </CustomerLayout>
  );
};

export default ProductsPage;
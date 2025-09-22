import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { AdminLayout } from '../components/AdminLayout';
import { ProductForm } from '../components/ProductForm';
import { useApi, useMutation } from '@/shared/hooks/useApi';
import { mockProductsApi, Product, ProductRequest } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { toast } from 'sonner';

/**
 * Admin products management page component
 * 
 * Features:
 * - Product listing with search and filters
 * - Create, edit, delete products
 * - Stock management
 * - Category management
 */
const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products
  const fetchProducts = useCallback(() => mockProductsApi.getProducts(), []);
  const {
    data: products,
    loading: productsLoading,
    execute: refetchProducts
  } = useApi(fetchProducts, { immediate: true });

  // Create product mutation
  const {
    loading: createLoading,
    execute: createProduct
  } = useMutation((productData: ProductRequest) => 
    mockProductsApi.createProduct(productData)
  );

  // Update product mutation
  const {
    loading: updateLoading,
    execute: updateProduct
  } = useMutation(({ id, data }: { id: string; data: Partial<ProductRequest> }) =>
    mockProductsApi.updateProduct(id, data)
  );

  // Delete product mutation
  const {
    loading: deleteLoading,
    execute: deleteProduct
  } = useMutation((id: string) => mockProductsApi.deleteProduct(id));

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

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (productData: ProductRequest) => {
    try {
      if (selectedProduct) {
        await updateProduct({ id: selectedProduct.id, data: productData });
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      
      await refetchProducts();
      setFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Operation failed';
      toast.error(errorMessage);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      await refetchProducts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  if (productsLoading) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" className="py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Product Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your product catalog, inventory, and pricing
            </Typography>
          </div>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateProduct}
            size="large"
          >
            Add Product
          </Button>
        </div>

        {products && products.length > 0 ? (
          <>
            <Typography variant="body2" color="textSecondary" className="mb-6">
              {products.length} product{products.length !== 1 ? 's' : ''} total
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="h-full flex flex-col">
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl || '/placeholder.svg'}
                    alt={product.name}
                    className="h-48 object-cover"
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

                    <Typography variant="h6" component="h3" className="mb-2">
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
                      
                      <Typography 
                        variant="body2" 
                        color={product.stockQuantity < 10 ? 'error' : 'textSecondary'}
                      >
                        Stock: {product.stockQuantity}
                      </Typography>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <Chip
                        label={product.inStock ? 'In Stock' : 'Out of Stock'}
                        color={product.inStock ? 'success' : 'error'}
                        size="small"
                      />
                      
                      <div>
                        <IconButton
                          size="small"
                          onClick={() => handleEditProduct(product)}
                          aria-label="edit product"
                        >
                          <Edit />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(product)}
                          aria-label="delete product"
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Alert severity="info" className="text-center">
            <Typography variant="h6" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" className="mb-4">
              Start by creating your first product
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateProduct}
            >
              Create First Product
            </Button>
          </Alert>
        )}

        {/* Product Form Dialog */}
        <ProductForm
          open={formOpen}
          product={selectedProduct}
          loading={createLoading || updateLoading}
          onClose={() => {
            setFormOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleFormSubmit}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{productToDelete?.name}"? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default ProductsPage;
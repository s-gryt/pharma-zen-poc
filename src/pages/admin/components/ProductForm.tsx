import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Product, ProductRequest, ProductCategory } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

/**
 * Product form props
 */
interface ProductFormProps {
  readonly open: boolean;
  readonly product?: Product | null;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (productData: ProductRequest) => Promise<void>;
}

/**
 * Product form component for creating and editing products
 */
export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  product,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProductRequest>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'pharmacy',
    imageUrl: product?.imageUrl || '',
    stockQuantity: product?.stockQuantity || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when product prop changes or dialog opens
  useEffect(() => {
    if (open && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stockQuantity: product.stockQuantity,
      });
      setErrors({});
    } else if (open && !product) {
      // Reset for new product
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'pharmacy',
        imageUrl: '',
        stockQuantity: 0,
      });
      setErrors({});
    }
  }, [open, product]);

  const categories: Array<{ value: ProductCategory; label: string }> = [
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'health', label: 'Health & Wellness' }, 
    { value: 'personal-care', label: 'Personal Care' },
  ];

  const handleInputChange = (field: keyof ProductRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'pharmacy',
      imageUrl: '',
      stockQuantity: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? 'Edit Product' : 'Create New Product'}
      </DialogTitle>
      
      <DialogContent>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Product Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
            
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            required
          />
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              error={!!errors.price}
              helperText={errors.price}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
            
            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity}
              inputProps={{ min: 0 }}
              required
            />
          </div>
            
          <TextField
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            placeholder="https://example.com/product-image.jpg"
          />
        </div>
      </DialogContent>
      
      <DialogActions className="p-4">
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
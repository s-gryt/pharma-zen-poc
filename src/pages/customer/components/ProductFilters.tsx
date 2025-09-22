import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Box,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { ProductCategory } from '@/shared/lib/api';

/**
 * Product filters props
 */
interface ProductFiltersProps {
  readonly searchTerm: string;
  readonly selectedCategory: ProductCategory | '';
  readonly onSearchChange: (search: string) => void;
  readonly onCategoryChange: (category: ProductCategory | '') => void;
  readonly onClearFilters: () => void;
}

/**
 * Product filters component
 * 
 * Provides search and filtering functionality for the product catalog
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}) => {
  const categories: Array<{ value: ProductCategory | ''; label: string }> = [
    { value: '', label: 'All Categories' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'personal-care', label: 'Personal Care' },
  ];

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <Paper className="p-4 mb-6">
      <Typography variant="h6" gutterBottom>
        Filter Products
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Search Input */}
        <TextField
          fullWidth
          label="Search products"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          placeholder="Search by name or description..."
        />

        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value as ProductCategory | '')}
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Box className="flex flex-wrap gap-2 items-center">
          <Typography variant="body2" color="textSecondary">
            Active filters:
          </Typography>
          
          {searchTerm && (
            <Chip
              label={`Search: "${searchTerm}"`}
              onDelete={() => onSearchChange('')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          
          {selectedCategory && (
            <Chip
              label={`Category: ${categories.find(c => c.value === selectedCategory)?.label}`}
              onDelete={() => onCategoryChange('')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          
          <Chip
            label="Clear All"
            onClick={onClearFilters}
            size="small"
            icon={<Clear />}
            variant="outlined"
            clickable
          />
        </Box>
      )}
    </Paper>
  );
};
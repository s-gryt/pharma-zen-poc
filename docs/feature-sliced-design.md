# Feature Sliced Design (FSD) Implementation Guide

## Overview
Feature Sliced Design is a frontend architecture methodology focusing on business logic organization and scalable code structure.

## Layer Structure

### 1. App Layer (`src/app/`)
**Purpose:** Application-wide configuration, providers, and routing setup

```
src/app/
├── providers/           # Global providers (Theme, Auth, Query)
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   └── index.ts
├── router/             # Route configuration
│   ├── AppRouter.tsx
│   ├── ProtectedRoute.tsx
│   └── routes.ts
├── store/              # Global state (if needed)
└── App.tsx             # Root component
```

**Import Rules:** Can import from pages, features, shared

### 2. Pages Layer (`src/pages/`)
**Purpose:** Route-level components that compose features into complete pages

```
src/pages/
├── customer/
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   ├── HomePage.module.scss
│   │   └── index.ts
│   ├── ProductsPage/
│   ├── CartPage/
│   └── CheckoutPage/
├── admin/
│   ├── DashboardPage/
│   ├── ProductsManagementPage/
│   └── OrdersManagementPage/
├── auth/
│   └── LoginPage/
└── common/
    └── NotFoundPage/
```

**Import Rules:** Can import from features, shared (NOT app)

### 3. Features Layer (`src/features/`)
**Purpose:** Business logic and domain-specific functionality

```
src/features/
├── authentication/
│   ├── api/            # Auth API calls
│   ├── hooks/          # useAuth, useLogin hooks
│   ├── types/          # Auth interfaces
│   ├── components/     # LoginForm, LogoutButton
│   └── index.ts        # Public exports
├── product-catalog/
│   ├── api/
│   ├── hooks/          # useProducts, useSearch
│   ├── components/     # ProductCard, ProductGrid
│   ├── types/
│   └── index.ts
├── shopping-cart/
│   ├── api/
│   ├── hooks/          # useCart, useCartPersistence
│   ├── components/     # CartItem, CartSummary
│   ├── types/
│   └── index.ts
└── order-management/
    ├── api/
    ├── hooks/
    ├── components/
    ├── types/
    └── index.ts
```

**Import Rules:** Can import from shared only (NOT app, pages, other features)

### 4. Shared Layer (`src/shared/`)
**Purpose:** Reusable components, utilities, and configurations

```
src/shared/
├── api/                # Base API configuration
│   ├── client.ts       # Axios/fetch setup
│   ├── types.ts        # Common API types
│   └── endpoints.ts    # API endpoints
├── components/         # Generic UI components
│   ├── ui/            # Basic components (Button, Input, etc.)
│   ├── layout/        # Layout components
│   └── forms/         # Form-related components
├── hooks/             # Generic custom hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useApi.ts
├── utils/             # Utility functions
│   ├── formatters.ts  # Date, currency formatting
│   ├── validators.ts  # Validation helpers
│   └── constants.ts   # App constants
├── types/             # Global TypeScript types
│   ├── common.ts      # Common interfaces
│   ├── api.ts         # API-related types
│   └── index.ts       # Export all types
└── styles/            # Global styles and variables
    ├── variables.scss # SCSS variables
    ├── mixins.scss    # SCSS mixins
    └── globals.scss   # Global styles
```

**Import Rules:** Cannot import from any other layer

## Example Implementation

### Feature: Product Catalog

```typescript
// src/features/product-catalog/types/index.ts
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly imageUrl: string;
  readonly description: string;
  readonly inStock: boolean;
}

export type ProductCategory = 'pharmacy' | 'health' | 'personal-care';

// src/features/product-catalog/api/index.ts
import { apiClient } from '@/shared/api';
import type { Product } from '../types';

export const productApi = {
  getProducts: async (category?: ProductCategory): Promise<Product[]> => {
    const response = await apiClient.get('/products', {
      params: { category }
    });
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get('/products/search', {
      params: { q: query }
    });
    return response.data;
  }
};

// src/features/product-catalog/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { productApi } from '../api';
import type { Product, ProductCategory } from '../types';

export const useProducts = (category?: ProductCategory) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await productApi.getProducts(category);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};
```

## Import Examples

```typescript
// ✅ Correct imports in pages layer
import { useAuth } from '@/features/authentication';
import { ProductGrid } from '@/features/product-catalog';
import { Layout } from '@/shared/components/layout';

// ✅ Correct imports in features layer  
import { apiClient } from '@/shared/api';
import { formatCurrency } from '@/shared/utils/formatters';

// ❌ Incorrect - feature importing from another feature
import { useCart } from '@/features/shopping-cart'; // In product-catalog feature

// ❌ Incorrect - shared importing from feature
import { useAuth } from '@/features/authentication'; // In shared layer
```

## Benefits

1. **Predictable Structure:** Developers know exactly where to find/place code
2. **Scalable Teams:** Multiple developers can work on different features without conflicts
3. **Maintainable:** Clear boundaries prevent tight coupling between features
4. **Testable:** Each layer can be tested in isolation
5. **Reusable:** Shared layer promotes component and utility reuse
/**
 * Shared API types and interfaces
 * 
 * This file contains all type definitions used across the application
 * for API requests, responses, and data models.
 * 
 * @fileoverview Centralized type definitions for API layer
 */

/**
 * Base API response structure
 * All API responses follow this consistent format
 */
export interface ApiResponse<T = unknown> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
  readonly errors?: readonly string[];
}

/**
 * API error response structure
 */
export interface ApiError {
  readonly message: string;
  readonly code: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}

/**
 * Authentication related types
 */
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
}

/**
 * User entity
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type UserRole = 'admin' | 'customer';

/**
 * Product entity
 */
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly imageUrl?: string;
  readonly inStock: boolean;
  readonly stockQuantity: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type ProductCategory = 'pharmacy' | 'health' | 'personal-care';

/**
 * Product creation/update request
 */
export interface ProductRequest {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly imageUrl?: string;
  readonly stockQuantity: number;
}

/**
 * Cart related types
 */
export interface CartItem {
  readonly id: string;
  readonly productId: string;
  readonly product: Product;
  readonly quantity: number;
  readonly addedAt: string;
}

export interface Cart {
  readonly id: string;
  readonly userId: string;
  readonly items: readonly CartItem[];
  readonly totalAmount: number;
  readonly updatedAt: string;
}

export interface AddToCartRequest {
  readonly productId: string;
  readonly quantity: number;
}

export interface UpdateCartItemRequest {
  readonly quantity: number;
}

/**
 * Order related types
 */
export interface Order {
  readonly id: string;
  readonly userId: string;
  readonly items: readonly OrderItem[];
  readonly totalAmount: number;
  readonly status: OrderStatus;
  readonly shippingAddress: Address;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrderItem {
  readonly id: string;
  readonly productId: string;
  readonly product: Product;
  readonly quantity: number;
  readonly price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
}

export interface CreateOrderRequest {
  readonly cartId: string;
  readonly shippingAddress: Address;
}

/**
 * Search and filter types
 */
export interface ProductSearchParams {
  readonly query?: string;
  readonly category?: ProductCategory;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly inStock?: boolean;
}
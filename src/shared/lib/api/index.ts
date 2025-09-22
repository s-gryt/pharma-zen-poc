/**
 * API layer entry point
 * 
 * Exports all API-related functionality including types,
 * client configuration, and service implementations.
 * 
 * @fileoverview API layer public interface
 */

// Types
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
  Product,
  ProductCategory,
  ProductRequest,
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  Order,
  OrderItem,
  OrderStatus,
  Address,
  CreateOrderRequest,
  ProductSearchParams,
} from './types';

// HTTP Client
export { apiClient, ApiClientError, createTimeoutSignal } from './client';

// Mock API Services (for development)
export {
  mockAuthApi,
  mockProductsApi,
  mockCartApi,
  mockOrdersApi,
} from './mock';
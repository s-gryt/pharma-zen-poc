# REST API Specification

This document provides a comprehensive specification for the Walgreens backend API. This specification serves as a contract between frontend and backend development teams and as a reference for future implementation.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base Response Format](#base-response-format)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Products Endpoints](#products-endpoints)
  - [Cart Endpoints](#cart-endpoints)
  - [Orders Endpoints](#orders-endpoints)
- [Data Models](#data-models)
- [Status Codes](#status-codes)

## Overview

**Base URL**: `https://api.walgreens.com/v1`
**Content Type**: `application/json`
**Authentication**: Bearer token (JWT)

### API Design Principles

- RESTful design patterns
- Consistent response formats
- Comprehensive error handling
- Pagination for list endpoints
- Filtering and sorting capabilities
- Rate limiting and security headers

## Authentication

### Bearer Token Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <jwt-token>
```

### Token Lifecycle

- **Access Token**: Valid for 1 hour
- **Refresh Token**: Valid for 30 days
- **Token Refresh**: Use refresh token to obtain new access token

## Base Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "data": <response-data>,
  "success": true,
  "message": "Request successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response

```json
{
  "data": null,
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error message"],
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Paginated Response

```json
{
  "data": [<array-of-items>],
  "success": true,
  "message": "Request successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Handling

### Standard Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## API Endpoints

### Authentication Endpoints

#### POST /auth/login

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here"
  },
  "success": true,
  "message": "Login successful"
}
```

#### POST /auth/refresh

Refresh authentication token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  },
  "success": true,
  "message": "Token refreshed"
}
```

#### POST /auth/logout

Logout current user and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "data": null,
  "success": true,
  "message": "Logout successful"
}
```

#### GET /auth/me

Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "data": {
    "id": "usr_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "User retrieved"
}
```

### Products Endpoints

#### GET /products

Get paginated list of products with filtering.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `category` (string: pharmacy, health, personal-care)
- `search` (string: search in name/description)
- `minPrice` (number: minimum price filter)
- `maxPrice` (number: maximum price filter)
- `inStock` (boolean: filter by stock availability)
- `sortBy` (string: name, price, createdAt)
- `sortOrder` (string: asc, desc)

**Response (200):**
```json
{
  "data": [
    {
      "id": "prod_123",
      "name": "Acetaminophen 500mg",
      "description": "Pain reliever and fever reducer",
      "price": 12.99,
      "category": "pharmacy",
      "imageUrl": "https://cdn.example.com/products/acetaminophen.jpg",
      "inStock": true,
      "stockQuantity": 100,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "success": true,
  "message": "Products retrieved",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /products/:id

Get single product by ID.

**Response (200):**
```json
{
  "data": {
    "id": "prod_123",
    "name": "Acetaminophen 500mg",
    "description": "Pain reliever and fever reducer",
    "price": 12.99,
    "category": "pharmacy",
    "imageUrl": "https://cdn.example.com/products/acetaminophen.jpg",
    "inStock": true,
    "stockQuantity": 100,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "Product retrieved"
}
```

#### POST /admin/products

Create new product (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 19.99,
  "category": "health",
  "imageUrl": "https://cdn.example.com/products/new-product.jpg",
  "stockQuantity": 50
}
```

**Response (201):**
```json
{
  "data": {
    "id": "prod_456",
    "name": "New Product",
    "description": "Product description",
    "price": 19.99,
    "category": "health",
    "imageUrl": "https://cdn.example.com/products/new-product.jpg",
    "inStock": true,
    "stockQuantity": 50,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "Product created"
}
```

#### PUT /admin/products/:id

Update existing product (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 24.99,
  "stockQuantity": 25
}
```

**Response (200):**
```json
{
  "data": {
    "id": "prod_123",
    "name": "Updated Product Name",
    "description": "Pain reliever and fever reducer",
    "price": 24.99,
    "category": "pharmacy",
    "imageUrl": "https://cdn.example.com/products/acetaminophen.jpg",
    "inStock": true,
    "stockQuantity": 25,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "success": true,
  "message": "Product updated"
}
```

#### DELETE /admin/products/:id

Delete product (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**
```json
{
  "data": null,
  "success": true,
  "message": "Product deleted"
}
```

### Cart Endpoints

#### GET /cart

Get current user's cart.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "data": {
    "id": "cart_123",
    "userId": "usr_123",
    "items": [
      {
        "id": "item_123",
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "name": "Acetaminophen 500mg",
          "price": 12.99,
          "imageUrl": "https://cdn.example.com/products/acetaminophen.jpg"
        },
        "quantity": 2,
        "addedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalAmount": 25.98,
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "Cart retrieved"
}
```

#### POST /cart/items

Add item to cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "data": {
    "id": "cart_123",
    "userId": "usr_123",
    "items": [
      {
        "id": "item_123",
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "name": "Acetaminophen 500mg",
          "price": 12.99,
          "imageUrl": "https://cdn.example.com/products/acetaminophen.jpg"
        },
        "quantity": 2,
        "addedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalAmount": 25.98,
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "Item added to cart"
}
```

#### PUT /cart/items/:itemId

Update cart item quantity.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "data": {
    "id": "cart_123",
    "userId": "usr_123",
    "items": [
      {
        "id": "item_123",
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "name": "Acetaminophen 500mg",
          "price": 12.99,
          "imageUrl": "https://cdn.example.com/products/acetaminophen.jpg"
        },
        "quantity": 3,
        "addedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalAmount": 38.97,
    "updatedAt": "2024-01-01T01:00:00Z"
  },
  "success": true,
  "message": "Cart item updated"
}
```

#### DELETE /cart/items/:itemId

Remove item from cart.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "data": {
    "id": "cart_123",
    "userId": "usr_123",
    "items": [],
    "totalAmount": 0,
    "updatedAt": "2024-01-01T01:00:00Z"
  },
  "success": true,
  "message": "Item removed from cart"
}
```

### Orders Endpoints

#### POST /orders

Create order from cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cartId": "cart_123",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "US"
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": "order_123",
    "userId": "usr_123",
    "items": [
      {
        "id": "orderitem_123",
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "name": "Acetaminophen 500mg",
          "price": 12.99
        },
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 25.98,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "US"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "Order created"
}
```

#### GET /orders

Get user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string: pending, confirmed, shipped, delivered, cancelled)

**Response (200):**
```json
{
  "data": [
    {
      "id": "order_123",
      "userId": "usr_123",
      "items": [
        {
          "id": "orderitem_123",
          "productId": "prod_123",
          "product": {
            "id": "prod_123",
            "name": "Acetaminophen 500mg"
          },
          "quantity": 2,
          "price": 12.99
        }
      ],
      "totalAmount": 25.98,
      "status": "pending",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "US"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "success": true,
  "message": "Orders retrieved",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### GET /admin/orders

Get all orders (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string: pending, confirmed, shipped, delivered, cancelled)
- `userId` (string: filter by user ID)

**Response (200):**
```json
{
  "data": [
    {
      "id": "order_123",
      "userId": "usr_123",
      "user": {
        "id": "usr_123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "items": [
        {
          "id": "orderitem_123",
          "productId": "prod_123",
          "product": {
            "id": "prod_123",
            "name": "Acetaminophen 500mg"
          },
          "quantity": 2,
          "price": 12.99
        }
      ],
      "totalAmount": 25.98,
      "status": "pending",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "US"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "success": true,
  "message": "Orders retrieved"
}
```

#### PUT /admin/orders/:id/status

Update order status (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "order_123",
    "userId": "usr_123",
    "items": [...],
    "totalAmount": 25.98,
    "status": "confirmed",
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T02:00:00Z"
  },
  "success": true,
  "message": "Order status updated"
}
```

## Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Product Model

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in USD
  category: 'pharmacy' | 'health' | 'personal-care';
  imageUrl?: string;
  inStock: boolean;
  stockQuantity: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Cart Model

```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number; // calculated field
  updatedAt: string; // ISO 8601
}

interface CartItem {
  id: string;
  productId: string;
  product: Product; // populated field
  quantity: number;
  addedAt: string; // ISO 8601
}
```

### Order Model

```typescript
interface Order {
  id: string;
  userId: string;
  user?: User; // populated in admin endpoints
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

interface OrderItem {
  id: string;
  productId: string;
  product: Product; // populated field
  quantity: number;
  price: number; // price at time of order
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

## Rate Limiting

- **General endpoints**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **Admin endpoints**: 200 requests per minute per authenticated user

## Security Headers

All responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## Changelog

### Version 1.0.0 (2024-01-01)
- Initial API specification
- Authentication endpoints
- Products CRUD operations
- Cart management
- Orders processing
- Admin functionality
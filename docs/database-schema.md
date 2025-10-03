# Database Schema Documentation - CURRENT IMPLEMENTATION STATUS

This document provides an **ACCURATE** database schema specification for the Walgreens application based on what is **CURRENTLY IMPLEMENTED** in the codebase.

**⚠️ IMPORTANT**: This reflects only what is actually used in the current application, with unused entities clearly marked.

## Table of Contents

- [Overview](#overview)
- [Currently Implemented Tables](#currently-implemented-tables)
- [Entity Relationships](#entity-relationships)
- [Not Implemented](#not-implemented)
- [Usage Notes](#usage-notes)

## Overview

**Database Type**: Mock API (localStorage-based persistence)
**Implementation**: In-memory arrays with localStorage backup
**Authentication**: Simple token + localStorage (no refresh tokens)

### Current Implementation Status

✅ **IMPLEMENTED**: Core e-commerce functionality
❌ **NOT IMPLEMENTED**: Sessions, audit logs, payment processing

---

## Currently Implemented Tables

### 1. Users Table ✅ IMPLEMENTED

**Purpose**: Stores user account information for admin and customer users.

**Current Fields**:
```typescript
interface User {
  id: string;           // UUID
  email: string;        // Unique identifier
  firstName: string;    // User's first name
  lastName: string;     // User's last name
  role: 'admin' | 'customer';  // User role
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

**Mock Data**: Admin and customer test users pre-populated

### 2. Products Table ✅ IMPLEMENTED

**Purpose**: Product catalog with inventory management.

**Current Fields**:
```typescript
interface Product {
  id: string;                    // UUID
  name: string;                  // Product name
  description: string;           // Product description
  price: number;                 // Product price
  category: 'pharmacy' | 'health' | 'personal-care';
  imageUrl?: string;             // Product image URL
  inStock: boolean;              // Calculated from stockQuantity
  stockQuantity: number;         // Available inventory
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

**Mock Data**: 18 sample products across all categories

### 3. Carts Table ✅ IMPLEMENTED

**Purpose**: Shopping cart sessions for authenticated users.

**Current Fields**:
```typescript
interface Cart {
  id: string;                    // UUID
  userId: string;                // Foreign key to User
  items: CartItem[];             // Array of cart items
  totalAmount: number;           // Calculated total
  updatedAt: string;             // ISO timestamp
}
```

**Persistence**: Stored in localStorage as 'user_cart'

### 4. Cart Items ✅ IMPLEMENTED

**Purpose**: Individual items within shopping carts.

**Current Fields**:
```typescript
interface CartItem {
  id: string;                    // UUID
  productId: string;             // Foreign key to Product
  product: Product;              // Embedded product data
  quantity: number;              // Item quantity
  addedAt: string;               // ISO timestamp
}
```

### 5. Orders Table ✅ IMPLEMENTED

**Purpose**: Completed orders with shipping information.

**Current Fields**:
```typescript
interface Order {
  id: string;                    // UUID
  userId: string;                // Foreign key to User
  items: OrderItem[];            // Array of order items
  totalAmount: number;           // Order total
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;      // Embedded address
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

**Mock Data**: 3 sample orders for testing

### 6. Order Items ✅ IMPLEMENTED

**Purpose**: Products within orders with historical pricing.

**Current Fields**:
```typescript
interface OrderItem {
  id: string;                    // UUID
  productId: string;             // Foreign key to Product
  product: Product;              // Embedded product data
  quantity: number;              // Item quantity
  price: number;                 // Historical price
}
```

### 7. Address (Embedded) ✅ IMPLEMENTED

**Purpose**: Shipping address structure.

**Current Fields**:
```typescript
interface Address {
  street: string;                // Street address
  city: string;                  // City name
  state: string;                 // State/province
  zipCode: string;               // Postal code
  country: string;               // Country code
}
```

---

## Entity Relationships - CURRENT IMPLEMENTATION

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │     CARTS       │       │    PRODUCTS     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ • id (PK)       │◄─────┐│ • id (PK)       │       │ • id (PK)       │
│ • email (UK)    │      ││ • userId (FK)   │   ┌──►│ • name          │
│ • firstName     │      ││ • items[]       │   │   │ • description   │
│ • lastName      │      ││ • totalAmount   │   │   │ • price         │
│ • role          │      ││ • updatedAt     │   │   │ • category      │
│ • createdAt     │      │└─────────────────┘   │   │ • imageUrl      │
│ • updatedAt     │      │         │             │   │ • inStock       │
└─────────────────┘      │         │             │   │ • stockQuantity │
         │                │         ▼             │   │ • createdAt     │
         │                │ ┌─────────────────┐   │   │ • updatedAt     │
         │                │ │   CART_ITEMS    │   │   └─────────────────┘
         │                │ ├─────────────────┤   │            ▲
         │                │ │ • id (PK)       │   │            │
         │                │ │ • productId(FK) │───┘            │
         │                │ │ • product (obj) │                │
         │                │ │ • quantity      │                │
         │                │ │ • addedAt       │                │
         │                │ └─────────────────┘                │
         │                │                                    │
         │                └──► ┌─────────────────┐             │
         │                     │     ORDERS      │             │
         └────────────────────►├─────────────────┤             │
                               │ • id (PK)       │             │
                               │ • userId (FK)   │             │
                               │ • items[]       │             │
                               │ • totalAmount   │             │
                               │ • status        │             │
                               │ • shippingAddr  │             │
                               │ • createdAt     │             │
                               │ • updatedAt     │             │
                               └─────────────────┘             │
                                        │                      │
                                        ▼                      │
                               ┌─────────────────┐             │
                               │   ORDER_ITEMS   │             │
                               ├─────────────────┤             │
                               │ • id (PK)       │             │
                               │ • productId(FK) │─────────────┘
                               │ • product (obj) │
                               │ • quantity      │
                               │ • price         │
                               └─────────────────┘

                  ┌─────────────────┐
                  │    ADDRESS      │
                  │   (Embedded)    │
                  ├─────────────────┤
                  │ • street        │
                  │ • city          │
                  │ • state         │
                  │ • zipCode       │
                  │ • country       │
                  └─────────────────┘
                           ▲
                           │
                  Used in Orders.shippingAddress
```

### Key Relationships (Currently Working):
1. **Users → Carts**: One-to-One (each user has one active cart)
2. **Carts → Cart Items**: One-to-Many (cart contains multiple items)
3. **Products → Cart Items**: Many-to-Many (products can be in multiple carts)
4. **Users → Orders**: One-to-Many (user can have multiple orders)
5. **Orders → Order Items**: One-to-Many (order contains multiple items)
6. **Products → Order Items**: Many-to-Many (products can be in multiple orders)
7. **Orders → Address**: One-to-One (embedded shipping address)

---

## ❌ NOT IMPLEMENTED

The following entities were planned but are **NOT CURRENTLY USED**:

### User Sessions Table ❌ NOT IMPLEMENTED

**Status**: Authentication uses localStorage instead
- No database session management
- No refresh token logic (despite being in types)
- Simple token + localStorage persistence

```typescript
// DEFINED IN TYPES BUT NOT USED
interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;  // ❌ NOT IMPLEMENTED
}
```

### Audit Logs Table ❌ NOT IMPLEMENTED

**Status**: No audit trail functionality
- No user action logging
- No change tracking
- No compliance audit trail

### Payment Processing ❌ NOT IMPLEMENTED

**Status**: Mock checkout only
- No payment methods stored
- No payment status tracking
- No payment processing integration

### Extended Product Fields ❌ NOT USED

Fields from original schema but not in current implementation:
- `sku` - Stock Keeping Unit
- `brand` - Product brand  
- `weight_oz` - Product weight
- `dimensions` - Product dimensions
- `active` - Product visibility flag

### Extended Order Fields ❌ NOT USED

Fields from original schema but not in current implementation:
- `orderNumber` - Human-readable order numbers
- `paymentStatus` - Payment processing status
- `paymentMethod` - Payment method used
- `paymentReference` - External payment references
- `trackingNumber` - Shipping tracking
- `shippedAt` / `deliveredAt` - Fulfillment timestamps
- `customerNotes` / `adminNotes` - Order notes

### Extended User Fields ❌ NOT USED

Fields from original schema but not in current implementation:
- `emailVerified` - Email verification status
- `lastLoginAt` - Last login timestamp
- `deletedAt` - Soft delete functionality

---

## Usage Notes

### Current Architecture
- **Mock API**: All data stored in memory arrays
- **Persistence**: Critical data (auth, cart) backed up to localStorage
- **Authentication**: Simple token-based with localStorage
- **State Management**: React Context providers

### What Actually Works
✅ User login/logout with persistence
✅ Product catalog browsing and filtering
✅ Shopping cart with persistence
✅ Order creation and management
✅ Admin order status updates
✅ Responsive design with Walgreens branding

### What's Missing
❌ Real database backend
❌ Session management system
❌ Payment processing
❌ Audit logging
❌ Email verification
❌ Order tracking
❌ Advanced product management

### Database Migration Path
When implementing a real backend:
1. Start with the 7 implemented entities
2. Add missing fields gradually as features are built
3. Implement user sessions when scaling authentication
4. Add audit logs when compliance is required
5. Integrate payment processing as needed

This documentation reflects the **actual current state** rather than aspirational future features.
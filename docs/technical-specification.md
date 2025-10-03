# Technical Specification - Walgreens

This document provides a comprehensive technical specification for implementing the Walgreens backend infrastructure, consolidating all models, contracts, and architectural decisions into a single reference.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Summary](#architecture-summary)
- [Technology Stack](#technology-stack)
- [API Contracts](#api-contracts)
- [Data Models](#data-models)
- [Database Implementation](#database-implementation)
- [Authentication & Security](#authentication--security)
- [Performance Requirements](#performance-requirements)
- [Deployment Considerations](#deployment-considerations)

## Project Overview

### Business Requirements

- **E-commerce Platform**: Online pharmacy and health products store
- **User Roles**: Customers and Administrators
- **Core Features**: Product catalog, shopping cart, order management, user authentication
- **Target Users**: Healthcare consumers and store administrators

### Technical Requirements

- **Scalability**: Support 10,000+ concurrent users
- **Performance**: Sub-200ms API response times
- **Security**: HIPAA-compliant data handling
- **Availability**: 99.9% uptime SLA
- **Data Integrity**: ACID compliance for transactions

## Architecture Summary

### Frontend Architecture (Existing)
- **Framework**: React 18.3.1 with TypeScript
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Context API + useReducer
- **UI Framework**: Material UI 7.3.2 + Tailwind CSS
- **Build Tool**: Vite
- **Architecture Pattern**: Feature Sliced Design (FSD)

### Backend Architecture (To Implement)
- **Pattern**: Clean Architecture / Hexagonal Architecture
- **API Style**: RESTful with OpenAPI specification
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT with refresh tokens
- **Caching**: Redis for session and query caching
- **File Storage**: Cloud storage for product images
- **Monitoring**: Application and database performance monitoring

## Technology Stack

### Recommended Backend Stack

```yaml
Runtime: Node.js 18+ / Python 3.11+ / .NET 8+
Framework: Express.js / FastAPI / ASP.NET Core
Database: PostgreSQL 15+
Cache: Redis 7+
Queue: Redis Bull / AWS SQS
Storage: AWS S3 / Google Cloud Storage
Monitoring: New Relic / Datadog
Deployment: Docker + Kubernetes / AWS ECS
```

## API Contracts

### Base Configuration

```yaml
Base URL: https://api.walgreens.com/v1
Content-Type: application/json
Authentication: Bearer JWT tokens
Rate Limiting: 1000 requests/hour per user
API Versioning: URL-based (/v1/, /v2/)
```

### Standard Response Format

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  timestamp: string; // ISO 8601
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Core Entity Models

```typescript
// User Management
interface User {
  id: string;           // Format: usr_123456789
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;    // seconds
}

// Product Management
interface Product {
  id: string;           // Format: prod_123456789
  name: string;
  description: string;
  price: number;        // USD decimal
  category: 'pharmacy' | 'health' | 'personal-care';
  imageUrl?: string;
  inStock: boolean;     // Computed field
  stockQuantity: number;
  sku: string;          // Stock Keeping Unit
  brand?: string;
  weightOz?: number;
  dimensions?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductSearchParams {
  query?: string;       // Full-text search
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Shopping Cart
interface Cart {
  id: string;           // Format: cart_123456789
  userId: string;
  items: CartItem[];
  totalAmount: number;  // Computed field
  expiresAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;           // Format: item_123456789
  productId: string;
  product: Product;     // Populated field
  quantity: number;
  addedAt: string;
}

interface AddToCartRequest {
  productId: string;
  quantity: number;
}

// Order Management
interface Order {
  id: string;           // Format: ord_123456789
  userId: string;
  orderNumber: string;  // Format: WLG-2024-001234
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentReference?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;           // Format: oitem_123456789
  productId: string;
  product: Product;     // Populated field
  productName: string;  // Snapshot at order time
  quantity: number;
  unitPrice: number;    // Price at order time
  totalPrice: number;   // Computed: quantity * unitPrice
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface CreateOrderRequest {
  cartId: string;
  shippingAddress: Address;
  paymentMethod: string;
  customerNotes?: string;
}
```

## Database Implementation

### Connection Configuration

```typescript
// PostgreSQL Connection Pool
const poolConfig = {
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production',
  pool: {
    min: 5,
    max: 20,
    idle: 10000,
    acquire: 60000,
  },
};
```

### Migration Strategy

```bash
# Migration files order
001_create_users_table.sql
002_create_products_table.sql
003_create_carts_table.sql
004_create_cart_items_table.sql
005_create_orders_table.sql
006_create_order_items_table.sql
007_create_user_sessions_table.sql
008_create_audit_logs_table.sql
009_create_indexes.sql
010_create_constraints.sql
011_insert_seed_data.sql
```

### Key Database Constraints

```sql
-- Business Logic Constraints
ALTER TABLE products ADD CONSTRAINT chk_price_positive CHECK (price >= 0);
ALTER TABLE cart_items ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0);
ALTER TABLE products ADD CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0);

-- Data Integrity
ALTER TABLE cart_items ADD CONSTRAINT uk_cart_product UNIQUE (cart_id, product_id);
ALTER TABLE users ADD CONSTRAINT uk_email UNIQUE (email);
ALTER TABLE orders ADD CONSTRAINT uk_order_number UNIQUE (order_number);

-- Performance Indexes
CREATE INDEX idx_products_category_stock ON products(category, in_stock, price);
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);
```

## Authentication & Security

### JWT Configuration

```typescript
interface JWTConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;   // '1h'
  refreshTokenExpiry: string;  // '30d'
  issuer: string;              // 'walgreens'
  audience: string;            // 'walgreens-users'
}

interface JWTPayload {
  sub: string;          // User ID
  email: string;
  role: 'admin' | 'customer';
  iat: number;          // Issued at
  exp: number;          // Expires at
  iss: string;          // Issuer
  aud: string;          // Audience
}
```

### Security Headers

```typescript
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

### Password Security

```typescript
// Password requirements
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  hashRounds: 12,        // bcrypt rounds
};
```

## Performance Requirements

### API Response Times

| Endpoint Category | Target Time | Max Time |
|------------------|-------------|----------|
| Authentication   | < 100ms     | 200ms    |
| Product Listing  | < 150ms     | 300ms    |
| Product Search   | < 200ms     | 400ms    |
| Cart Operations  | < 100ms     | 200ms    |
| Order Creation   | < 300ms     | 500ms    |
| Admin Operations | < 200ms     | 400ms    |

### Caching Strategy

```typescript
interface CacheConfig {
  // Product catalog cache
  productList: {
    ttl: 300,      // 5 minutes
    key: 'products:list:{category}:{page}',
  },
  
  // User session cache
  userSession: {
    ttl: 3600,     // 1 hour
    key: 'session:{userId}',
  },
  
  // Search results cache
  searchResults: {
    ttl: 600,      // 10 minutes
    key: 'search:{query}:{filters}',
  },
};
```

### Database Optimization

```sql
-- Query optimization examples
-- Index for product search
CREATE INDEX CONCURRENTLY idx_products_search_category 
ON products USING gin(to_tsvector('english', name || ' ' || description)) 
WHERE category = ANY('{pharmacy,health,personal-care}'::text[]);

-- Partial index for active products
CREATE INDEX CONCURRENTLY idx_products_active 
ON products(category, price) WHERE active = true AND in_stock = true;

-- Covering index for cart operations
CREATE INDEX CONCURRENTLY idx_cart_items_covering 
ON cart_items(cart_id) INCLUDE (product_id, quantity, added_at);
```

## Deployment Considerations

### Environment Configuration

```yaml
# Production Environment
NODE_ENV: production
PORT: 3000

# Database
DATABASE_URL: postgresql://user:pass@host:5432/dbname
DATABASE_POOL_MIN: 5
DATABASE_POOL_MAX: 20

# Redis Cache
REDIS_URL: redis://host:6379
REDIS_PASSWORD: secure_password

# JWT Secrets
JWT_ACCESS_SECRET: 256-bit-secret
JWT_REFRESH_SECRET: 256-bit-secret

# External Services
AWS_S3_BUCKET: walgreens-assets
STRIPE_SECRET_KEY: sk_live_...
SENDGRID_API_KEY: sg_live_...

# Monitoring
NEW_RELIC_KEY: license_key
LOG_LEVEL: info
```

### Docker Configuration

```dockerfile
# Multi-stage Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Check Endpoints

```typescript
// Health check implementation
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});
```

### Monitoring & Logging

```typescript
// Structured logging format
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  userId?: string;
  requestId: string;
  duration?: number;
  statusCode?: number;
  error?: {
    name: string;
    message: string;
    stack: string;
  };
}
```

This technical specification provides a complete foundation for implementing the backend infrastructure while maintaining consistency with the existing frontend TypeScript models and architectural decisions.
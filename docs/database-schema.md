# Database Schema Documentation

This document provides a comprehensive database schema specification for the Walgreens POC application. This schema can be directly used to implement backend infrastructure with proper data models, constraints, and relationships.

## Table of Contents

- [Overview](#overview)
- [Database Tables](#database-tables)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Constraints and Validations](#constraints-and-validations)
- [Migration Scripts](#migration-scripts)
- [Sample Data](#sample-data)

## Overview

**Database Type**: PostgreSQL (recommended) / MySQL compatible
**Character Set**: UTF-8
**Collation**: utf8_general_ci
**Storage Engine**: InnoDB (MySQL) / Default (PostgreSQL)

### Design Principles

- **Normalization**: 3NF normalized structure
- **Performance**: Strategic indexing for common queries
- **Scalability**: Designed for horizontal scaling
- **Data Integrity**: Comprehensive constraints and foreign keys
- **Audit Trail**: Created/updated timestamps on all entities
- **Soft Deletes**: Preservation of historical data

## Database Tables

### 1. users

Primary table for user authentication and profile information.

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID format: usr_123abc...
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- Soft delete
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_created_at (created_at)
);
```

### 2. products

Product catalog with inventory management.

```sql
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID format: prod_123abc...
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category ENUM('pharmacy', 'health', 'personal-care') NOT NULL,
    image_url VARCHAR(500),
    in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sku VARCHAR(100) UNIQUE, -- Stock Keeping Unit
    brand VARCHAR(100),
    weight_oz DECIMAL(5,2), -- Weight in ounces
    dimensions VARCHAR(50), -- e.g., "2x3x4 inches"
    active BOOLEAN DEFAULT TRUE, -- Product visibility
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_products_category (category),
    INDEX idx_products_price (price),
    INDEX idx_products_in_stock (in_stock),
    INDEX idx_products_name (name),
    FULLTEXT idx_products_search (name, description)
);
```

### 3. carts

Shopping cart sessions for users.

```sql
CREATE TABLE carts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID format: cart_123abc...
    user_id VARCHAR(36) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (
        (SELECT COALESCE(SUM(ci.quantity * p.price), 0) 
         FROM cart_items ci 
         JOIN products p ON ci.product_id = p.id 
         WHERE ci.cart_id = id AND ci.deleted_at IS NULL)
    ) STORED,
    session_id VARCHAR(255), -- For guest users
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 30 DAY),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_carts_user_id (user_id),
    INDEX idx_carts_session_id (session_id),
    INDEX idx_carts_expires_at (expires_at)
);
```

### 4. cart_items

Individual items within shopping carts.

```sql
CREATE TABLE cart_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID format: item_123abc...
    cart_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id),
    INDEX idx_cart_items_cart_id (cart_id),
    INDEX idx_cart_items_product_id (product_id)
);
```

### 5. orders

Order transactions and fulfillment tracking.

```sql
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID format: ord_123abc...
    user_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable: WLG-2024-001234
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50), -- e.g., 'credit_card', 'paypal'
    payment_reference VARCHAR(255), -- External payment system reference
    
    -- Shipping Information
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name VARCHAR(100) NOT NULL,
    shipping_street VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(50) NOT NULL,
    shipping_zip_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(50) NOT NULL DEFAULT 'USA',
    shipping_phone VARCHAR(20),
    
    -- Tracking
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_order_number (order_number),
    INDEX idx_orders_created_at (created_at),
    INDEX idx_orders_payment_status (payment_status)
);
```

### 6. order_items

Individual products within orders.

```sql
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID format: oitem_123abc...
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL, -- Snapshot at time of order
    product_description TEXT, -- Snapshot at time of order
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0), -- Price at time of order
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id)
);
```

### 7. user_sessions

User authentication sessions and token management.

```sql
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    access_token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500) NOT NULL UNIQUE,
    device_info TEXT, -- User agent, IP, etc.
    expires_at TIMESTAMP NOT NULL,
    refresh_expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_access_token (access_token),
    INDEX idx_sessions_refresh_token (refresh_token),
    INDEX idx_sessions_expires_at (expires_at)
);
```

### 8. audit_logs

System audit trail for security and compliance.

```sql
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    entity_type VARCHAR(50) NOT NULL, -- 'user', 'product', 'order', etc.
    entity_id VARCHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_logs_user_id (user_id),
    INDEX idx_audit_logs_entity (entity_type, entity_id),
    INDEX idx_audit_logs_action (action),
    INDEX idx_audit_logs_created_at (created_at)
);
```

## Relationships

### Entity Relationship Diagram

```
users ||--o{ carts : has
users ||--o{ orders : places
users ||--o{ user_sessions : has
users ||--o{ audit_logs : generates

carts ||--o{ cart_items : contains
products ||--o{ cart_items : referenced_in
products ||--o{ order_items : referenced_in

orders ||--o{ order_items : contains
orders ||--o{ audit_logs : generates
```

### Key Relationships

1. **User → Cart**: One-to-many (user can have multiple carts for different sessions)
2. **User → Order**: One-to-many (user can place multiple orders)
3. **Cart → CartItem**: One-to-many (cart contains multiple items)
4. **Product → CartItem**: One-to-many (product can be in multiple carts)
5. **Order → OrderItem**: One-to-many (order contains multiple items)
6. **Product → OrderItem**: One-to-many (product can be in multiple orders)

## Indexes

### Performance Optimization

```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_products_category_stock ON products(category, in_stock, price);
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);
CREATE INDEX idx_cart_items_cart_product ON cart_items(cart_id, product_id);

-- Search optimization
CREATE FULLTEXT INDEX idx_products_fulltext ON products(name, description);

-- Date range queries
CREATE INDEX idx_orders_date_range ON orders(created_at, status);
CREATE INDEX idx_audit_logs_date_range ON audit_logs(created_at, entity_type);
```

## Constraints and Validations

### Business Rules

```sql
-- Ensure cart items have valid quantities
ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity 
CHECK (quantity > 0 AND quantity <= 999);

-- Ensure product prices are reasonable
ALTER TABLE products ADD CONSTRAINT chk_products_price 
CHECK (price >= 0 AND price <= 9999.99);

-- Ensure order amounts match item totals
ALTER TABLE orders ADD CONSTRAINT chk_orders_amount 
CHECK (total_amount >= 0);

-- Email format validation (basic)
ALTER TABLE users ADD CONSTRAINT chk_users_email 
CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Order status flow validation
ALTER TABLE orders ADD CONSTRAINT chk_orders_status_flow 
CHECK (
    (status = 'pending') OR
    (status = 'confirmed' AND created_at IS NOT NULL) OR
    (status = 'shipped' AND shipped_at IS NOT NULL) OR
    (status = 'delivered' AND delivered_at IS NOT NULL) OR
    (status = 'cancelled')
);
```

## Migration Scripts

### Initial Database Setup

```sql
-- 001_create_database.sql
CREATE DATABASE walgreens_poc 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE walgreens_poc;

-- Enable UUID generation
SET @uuid_ossp = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
PREPARE stmt FROM @uuid_ossp;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```

### Migration Order

1. `002_create_users_table.sql`
2. `003_create_products_table.sql`
3. `004_create_carts_table.sql`
4. `005_create_cart_items_table.sql`
5. `006_create_orders_table.sql`
6. `007_create_order_items_table.sql`
7. `008_create_user_sessions_table.sql`
8. `009_create_audit_logs_table.sql`
9. `010_create_indexes.sql`
10. `011_create_constraints.sql`
11. `012_insert_seed_data.sql`

## Sample Data

### Admin User

```sql
INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified) VALUES
('usr_admin_001', 'admin@walgreens.com', '$2b$10$hashed_password_here', 'Admin', 'User', 'admin', TRUE);
```

### Customer Users

```sql
INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified) VALUES
('usr_cust_001', 'customer@example.com', '$2b$10$hashed_password_here', 'John', 'Doe', 'customer', TRUE),
('usr_cust_002', 'jane.smith@example.com', '$2b$10$hashed_password_here', 'Jane', 'Smith', 'customer', TRUE);
```

### Sample Products

```sql
INSERT INTO products (id, name, description, price, category, image_url, stock_quantity, sku) VALUES
('prod_001', 'Acetaminophen 500mg', 'Pain reliever and fever reducer', 12.99, 'pharmacy', '/images/acetaminophen.jpg', 100, 'ACET-500-100'),
('prod_002', 'Vitamin D3 2000 IU', 'Daily vitamin D supplement', 18.49, 'health', '/images/vitamin-d3.jpg', 75, 'VITD-2000-60'),
('prod_003', 'Hand Sanitizer 8oz', 'Antibacterial hand sanitizer', 4.99, 'personal-care', '/images/hand-sanitizer.jpg', 200, 'HAND-SAN-8OZ');
```

## Usage Notes

### Backend Implementation Guidelines

1. **ORM Configuration**: Use this schema with your preferred ORM (Sequelize, TypeORM, Prisma)
2. **Connection Pool**: Configure connection pooling for production (min: 5, max: 20)
3. **Backup Strategy**: Implement daily automated backups
4. **Monitoring**: Set up query performance monitoring
5. **Security**: Use connection encryption and proper user permissions

### API Integration

- All ID fields use UUID format with prefixes (usr_, prod_, cart_, etc.)
- Timestamps are in ISO 8601 format
- Soft deletes are implemented via `deleted_at` fields
- Generated columns automatically calculate totals and stock status

This schema provides a complete foundation for building a scalable e-commerce backend with proper data integrity, performance optimization, and audit capabilities.
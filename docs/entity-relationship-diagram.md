# Entity Relationship Diagram

This document provides visual representations of the database relationships and data flow for the Walgreens POC application.

## Database Entity Relationships

```mermaid
erDiagram
    USERS {
        string id PK "usr_123abc..."
        string email UK "user@example.com"
        string password_hash "bcrypt hashed"
        string first_name
        string last_name
        enum role "admin|customer"
        boolean email_verified
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }
    
    PRODUCTS {
        string id PK "prod_123abc..."
        string name
        text description
        decimal price "CHECK >= 0"
        enum category "pharmacy|health|personal-care"
        string image_url
        boolean in_stock "GENERATED COLUMN"
        int stock_quantity "CHECK >= 0"
        string sku UK
        string brand
        decimal weight_oz
        string dimensions
        boolean active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    CARTS {
        string id PK "cart_123abc..."
        string user_id FK
        decimal total_amount "GENERATED COLUMN"
        string session_id "for guests"
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    CART_ITEMS {
        string id PK "item_123abc..."
        string cart_id FK
        string product_id FK
        int quantity "CHECK > 0"
        timestamp added_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    ORDERS {
        string id PK "ord_123abc..."
        string user_id FK
        string order_number UK "WLG-2024-001234"
        decimal total_amount "CHECK >= 0"
        enum status "pending|confirmed|shipped|delivered|cancelled"
        enum payment_status "pending|paid|failed|refunded"
        string payment_method
        string payment_reference
        string shipping_first_name
        string shipping_last_name
        string shipping_street
        string shipping_city
        string shipping_state
        string shipping_zip_code
        string shipping_country
        string shipping_phone
        string tracking_number
        timestamp shipped_at
        timestamp delivered_at
        text customer_notes
        text admin_notes
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    ORDER_ITEMS {
        string id PK "oitem_123abc..."
        string order_id FK
        string product_id FK
        string product_name "snapshot"
        text product_description "snapshot"
        int quantity "CHECK > 0"
        decimal unit_price "price at order time"
        decimal total_price "GENERATED COLUMN"
        timestamp created_at
    }
    
    USER_SESSIONS {
        string id PK
        string user_id FK
        string access_token UK
        string refresh_token UK
        text device_info
        timestamp expires_at
        timestamp refresh_expires_at
        timestamp created_at
        timestamp last_used_at
        timestamp revoked_at
    }
    
    AUDIT_LOGS {
        string id PK
        string user_id FK
        string entity_type "user|product|order|etc"
        string entity_id
        string action "create|update|delete|login|etc"
        json old_values
        json new_values
        string ip_address
        text user_agent
        timestamp created_at
    }

    %% Relationships
    USERS ||--o{ CARTS : "has"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ USER_SESSIONS : "has"
    USERS ||--o{ AUDIT_LOGS : "generates"
    
    CARTS ||--o{ CART_ITEMS : "contains"
    PRODUCTS ||--o{ CART_ITEMS : "referenced_in"
    PRODUCTS ||--o{ ORDER_ITEMS : "referenced_in"
    
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ AUDIT_LOGS : "generates"
```

## Data Flow Diagrams

### User Shopping Flow

```mermaid
flowchart TD
    A[User Registration/Login] --> B[Browse Products]
    B --> C[Add to Cart]
    C --> D[View Cart]
    D --> E{Continue Shopping?}
    E -->|Yes| B
    E -->|No| F[Proceed to Checkout]
    F --> G[Enter Shipping Info]
    G --> H[Place Order]
    H --> I[Order Confirmation]
    I --> J[Order Processing]
    J --> K[Order Shipped]
    K --> L[Order Delivered]
    
    %% Data Operations
    A -.-> M[(User Table)]
    B -.-> N[(Products Table)]
    C -.-> O[(Cart & Cart_Items Tables)]
    H -.-> P[(Orders & Order_Items Tables)]
    J -.-> Q[(Audit_Logs Table)]
```

### Admin Management Flow

```mermaid
flowchart TD
    A[Admin Login] --> B[Dashboard View]
    B --> C{Management Task}
    C -->|Products| D[Product Management]
    C -->|Orders| E[Order Management]
    C -->|Users| F[User Management]
    
    D --> D1[Add Product]
    D --> D2[Update Product]
    D --> D3[Delete Product]
    
    E --> E1[View Orders]
    E --> E2[Update Order Status]
    E --> E3[Process Refunds]
    
    F --> F1[View Users]
    F --> F2[Manage Permissions]
    
    %% Audit Trail
    D1 -.-> G[(Audit_Logs)]
    D2 -.-> G
    D3 -.-> G
    E2 -.-> G
    E3 -.-> G
```

## Database Architecture Layers

```mermaid
graph TB
    subgraph "Application Layer"
        A1[REST API Endpoints]
        A2[Authentication Middleware]
        A3[Validation Layer]
    end
    
    subgraph "Business Logic Layer"
        B1[User Management]
        B2[Product Catalog]
        B3[Shopping Cart]
        B4[Order Processing]
        B5[Payment Processing]
    end
    
    subgraph "Data Access Layer"
        C1[ORM/Query Builder]
        C2[Connection Pool]
        C3[Transaction Management]
        C4[Cache Layer]
    end
    
    subgraph "Database Layer"
        D1[(Primary Database)]
        D2[(Read Replicas)]
        D3[(Backup Storage)]
    end
    
    A1 --> B1
    A1 --> B2
    A1 --> B3
    A1 --> B4
    
    B1 --> C1
    B2 --> C1
    B3 --> C1
    B4 --> C1
    B5 --> C1
    
    C1 --> D1
    C2 --> D1
    C1 --> D2
    
    D1 --> D3
```

## Security Model

```mermaid
graph TD
    A[Client Request] --> B{Authenticated?}
    B -->|No| C[Authentication Required]
    B -->|Yes| D{Authorized?}
    D -->|No| E[Access Denied]
    D -->|Yes| F[Process Request]
    
    F --> G{Data Modification?}
    G -->|Yes| H[Log to Audit Trail]
    G -->|No| I[Return Response]
    H --> I
    
    %% Security Layers
    subgraph "Security Layers"
        S1[Rate Limiting]
        S2[Input Validation]
        S3[SQL Injection Prevention]
        S4[XSS Protection]
        S5[CSRF Protection]
    end
    
    A --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> B
```

## Performance Optimization

### Indexing Strategy

```mermaid
graph LR
    subgraph "Primary Indexes"
        P1[users.email]
        P2[products.category]
        P3[orders.user_id]
        P4[cart_items.cart_id]
    end
    
    subgraph "Composite Indexes"
        C1[products(category, in_stock, price)]
        C2[orders(user_id, status, created_at)]
        C3[cart_items(cart_id, product_id)]
    end
    
    subgraph "Full-Text Indexes"
        F1[products(name, description)]
    end
    
    subgraph "Query Types"
        Q1[Product Search] --> F1
        Q2[User Orders] --> C2
        Q3[Cart Operations] --> C3
        Q4[Category Browse] --> C1
    end
```

### Caching Strategy

```mermaid
graph TD
    A[Client Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached Data]
    B -->|No| D[Query Database]
    D --> E[Cache Result]
    E --> F[Return Data]
    
    subgraph "Cache Layers"
        L1[Application Cache - Product Catalog]
        L2[Session Cache - User Data]
        L3[Query Cache - Common Searches]
        L4[Page Cache - Static Content]
    end
    
    subgraph "Cache Invalidation"
        I1[Product Updates → Clear L1]
        I2[User Changes → Clear L2]
        I3[New Products → Clear L3]
    end
```

This comprehensive documentation provides all the visual representations and architectural guidance needed for implementing a robust backend infrastructure that aligns with the existing frontend TypeScript models and API contracts.
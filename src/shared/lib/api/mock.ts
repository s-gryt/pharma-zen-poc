/**
 * Mock API implementation
 * 
 * Provides mock data and simulated API responses for development.
 * This will be replaced with real API calls in production.
 * 
 * @fileoverview Mock API services for development
 */

import {
  User,
  Product,
  Cart,
  Order,
  LoginRequest,
  LoginResponse,
  ProductRequest,
  AddToCartRequest,
  CreateOrderRequest,
  ApiResponse,
  ProductCategory,
  OrderStatus,
} from './types';

/**
 * Simulated network delay for realistic testing
 */
const MOCK_DELAY = 500;

/**
 * Utility function to simulate API delay
 */
const delay = (ms: number = MOCK_DELAY): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate mock API response wrapper
 */
const createMockResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  success: true,
  message: 'Request successful',
});

/**
 * Mock data storage (simulates database)
 */
let mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@walgreens.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'customer-1',
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

let mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Acetaminophen 500mg',
    description: 'Pain reliever and fever reducer',
    price: 12.99,
    category: 'pharmacy',
    imageUrl: '/images/acetaminophen.jpg',
    inStock: true,
    stockQuantity: 100,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Vitamin D3 2000 IU',
    description: 'Supports bone and immune health',
    price: 15.99,
    category: 'health',
    imageUrl: '/images/vitamin-d3.jpg',
    inStock: true,
    stockQuantity: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Moisturizing Face Cream',
    description: 'Daily hydrating face cream for all skin types',
    price: 24.99,
    category: 'personal-care',
    imageUrl: '/images/face-cream.jpg',
    inStock: true,
    stockQuantity: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

let mockCarts: Cart[] = [];
let mockOrders: Order[] = [];
let currentUser: User | null = null;

/**
 * Generate unique ID for mock entities
 */
const generateId = (): string => `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock Authentication API
 */
export const mockAuthApi = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    await delay();

    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Simple password check - in real app, this would be properly hashed
    const validPasswords: Record<string, string> = {
      'admin@walgreens.com': 'admin123',
      'customer@example.com': 'customer123',
    };

    if (validPasswords[credentials.email] !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    currentUser = user;

    return createMockResponse({
      user,
      token: `mock-token-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`,
    });
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    await delay();
    currentUser = null;
    return createMockResponse(undefined);
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay();
    
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    return createMockResponse(currentUser);
  },
};

/**
 * Mock Products API
 */
export const mockProductsApi = {
  /**
   * Get all products with optional filtering
   */
  async getProducts(params?: {
    category?: ProductCategory;
    search?: string;
  }): Promise<ApiResponse<Product[]>> {
    await delay();

    let filteredProducts = [...mockProducts];

    if (params?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return createMockResponse(filteredProducts);
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await delay();

    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    return createMockResponse(product);
  },

  /**
   * Create new product (Admin only)
   */
  async createProduct(productData: ProductRequest): Promise<ApiResponse<Product>> {
    await delay();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const newProduct: Product = {
      id: generateId(),
      ...productData,
      inStock: productData.stockQuantity > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProducts.push(newProduct);
    return createMockResponse(newProduct);
  },

  /**
   * Update existing product (Admin only)
   */
  async updateProduct(id: string, productData: Partial<ProductRequest>): Promise<ApiResponse<Product>> {
    await delay();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct: Product = {
      ...mockProducts[productIndex],
      ...productData,
      inStock: productData.stockQuantity ? productData.stockQuantity > 0 : mockProducts[productIndex].inStock,
      updatedAt: new Date().toISOString(),
    };

    mockProducts[productIndex] = updatedProduct;
    return createMockResponse(updatedProduct);
  },

  /**
   * Delete product (Admin only)
   */
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    await delay();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    mockProducts.splice(productIndex, 1);
    return createMockResponse(undefined);
  },
};

/**
 * Mock Cart API
 */
export const mockCartApi = {
  /**
   * Get current user's cart
   */
  async getCart(): Promise<ApiResponse<Cart | null>> {
    await delay();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const cart = mockCarts.find(c => c.userId === currentUser.id);
    return createMockResponse(cart || null);
  },

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<ApiResponse<Cart>> {
    await delay();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const product = mockProducts.find(p => p.id === request.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let cart = mockCarts.find(c => c.userId === currentUser.id);
    
    if (!cart) {
      cart = {
        id: generateId(),
        userId: currentUser.id,
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      };
      mockCarts.push(cart);
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId === request.productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + request.quantity,
      };
      cart = { ...cart, items: updatedItems };
    } else {
      // Add new item
      const newItem = {
        id: generateId(),
        productId: request.productId,
        product,
        quantity: request.quantity,
        addedAt: new Date().toISOString(),
      };
      cart = {
        ...cart,
        items: [...cart.items, newItem],
      };
    }

    // Recalculate total
    cart = {
      ...cart,
      totalAmount: cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      updatedAt: new Date().toISOString(),
    };

    // Update mock data
    const cartIndex = mockCarts.findIndex(c => c.id === cart.id);
    mockCarts[cartIndex] = cart;

    return createMockResponse(cart);
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    await delay();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const cart = mockCarts.find(c => c.userId === currentUser.id);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const updatedCart = {
      ...cart,
      items: cart.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    };

    // Recalculate total
    updatedCart.totalAmount = updatedCart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );

    const cartIndex = mockCarts.findIndex(c => c.id === cart.id);
    mockCarts[cartIndex] = updatedCart;

    return createMockResponse(updatedCart);
  },
};

/**
 * Mock Orders API
 */
export const mockOrdersApi = {
  /**
   * Create order from cart
   */
  async createOrder(request: CreateOrderRequest): Promise<ApiResponse<Order>> {
    await delay();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const cart = mockCarts.find(c => c.id === request.cartId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart not found or empty');
    }

    const order: Order = {
      id: generateId(),
      userId: currentUser.id,
      items: cart.items.map(cartItem => ({
        id: generateId(),
        productId: cartItem.productId,
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      })),
      totalAmount: cart.totalAmount,
      status: 'pending',
      shippingAddress: request.shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrders.push(order);

    // Clear cart after order creation
    const cartIndex = mockCarts.findIndex(c => c.id === cart.id);
    if (cartIndex >= 0) {
      mockCarts.splice(cartIndex, 1);
    }

    return createMockResponse(order);
  },

  /**
   * Get user's orders
   */
  async getOrders(): Promise<ApiResponse<Order[]>> {
    await delay();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const userOrders = mockOrders.filter(o => o.userId === currentUser.id);
    return createMockResponse(userOrders);
  },

  /**
   * Get all orders (Admin only)
   */
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    await delay();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    return createMockResponse([...mockOrders]);
  },

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    await delay();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const updatedOrder = {
      ...mockOrders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    mockOrders[orderIndex] = updatedOrder;
    return createMockResponse(updatedOrder);
  },
};
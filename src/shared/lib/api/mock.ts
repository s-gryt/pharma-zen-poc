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
    description: 'Pain reliever and fever reducer for headaches, muscle aches, and minor pain',
    price: 12.99,
    category: 'pharmacy',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 100,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Vitamin D3 2000 IU',
    description: 'Supports bone and immune health with high-potency vitamin D supplement',
    price: 15.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Moisturizing Face Cream',
    description: 'Daily hydrating face cream for all skin types with SPF 15 protection',
    price: 24.99,
    category: 'personal-care',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Ibuprofen 200mg',
    description: 'Anti-inflammatory pain reliever for arthritis, back pain, and inflammation',
    price: 9.99,
    category: 'pharmacy',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 75,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Multivitamin for Adults',
    description: 'Complete daily multivitamin with essential vitamins and minerals',
    price: 28.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 40,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Vitamin C 1000mg',
    description: 'Immune support supplement with high-potency vitamin C',
    price: 18.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 60,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Hydrating Body Lotion',
    description: 'Rich moisturizing lotion for dry skin with 24-hour hydration',
    price: 16.99,
    category: 'personal-care',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 35,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Allergy Relief Tablets',
    description: 'Non-drowsy 24-hour allergy relief for seasonal allergies',
    price: 21.99,
    category: 'pharmacy',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Omega-3 Fish Oil',
    description: 'Heart and brain health supplement with EPA and DHA',
    price: 32.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 30,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Anti-Aging Serum',
    description: 'Advanced anti-aging serum with retinol and hyaluronic acid',
    price: 45.99,
    category: 'personal-care',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 20,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-11',
    name: 'Cough Syrup',
    description: 'Effective cough suppressant for dry and productive coughs',
    price: 13.99,
    category: 'pharmacy',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 55,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-12',
    name: 'Probiotics Capsules',
    description: 'Digestive health support with 10 billion live cultures',
    price: 26.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 42,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-13',
    name: 'Sunscreen SPF 50',
    description: 'Broad-spectrum sun protection for face and body',
    price: 19.99,
    category: 'personal-care',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 38,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-14',
    name: 'Cold & Flu Relief',
    description: 'Multi-symptom relief for cold and flu symptoms',
    price: 17.99,
    category: 'pharmacy',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 48,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-15',
    name: 'Calcium & Magnesium',
    description: 'Bone health supplement with calcium and magnesium',
    price: 22.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 33,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-16',
    name: 'Hand Sanitizer',
    description: '70% alcohol hand sanitizer for effective germ protection',
    price: 4.99,
    category: 'personal-care',
    imageUrl: '/placeholder.svg',
    inStock: true,
    stockQuantity: 100,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-17',
    name: 'B-Complex Vitamins',
    description: 'Energy support with essential B vitamins complex',
    price: 19.99,
    category: 'health',
    imageUrl: '/placeholder.svg',
    inStock: false,
    stockQuantity: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-18',
    name: 'Thermometer Digital',
    description: 'Fast and accurate digital thermometer for family use',
    price: 14.99,
    category: 'pharmacy',
    imageUrl: '/placeholder.svg',
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
    console.log('mockProductsApi.getProducts called with params:', params);
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

    console.log('mockProductsApi.getProducts returning:', filteredProducts.length, 'products');
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
    console.log('mockOrdersApi.getAllOrders called');
    await delay();

    if (!currentUser || currentUser.role !== 'admin') {
      console.error('Unauthorized access to getAllOrders');
      throw new Error('Unauthorized');
    }

    console.log('mockOrdersApi.getAllOrders returning:', mockOrders.length, 'orders');
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
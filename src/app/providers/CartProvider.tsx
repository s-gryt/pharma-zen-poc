import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCartApi, Cart, Product } from '@/shared/lib/api';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

/**
 * Cart context interface
 */
interface CartContextType {
  readonly cart: Cart | null;
  readonly itemCount: number;
  readonly loading: boolean;
  readonly addToCart: (product: Product, quantity?: number) => Promise<void>;
  readonly removeFromCart: (itemId: string) => Promise<void>;
  readonly refreshCart: () => Promise<void>;
  readonly clearCart: () => void;
}

/**
 * Cart context
 */
const CartContext = createContext<CartContextType | null>(null);

/**
 * Hook to access cart context
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Cart provider props
 */
interface CartProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Cart provider component
 * 
 * Manages shopping cart state and provides cart operations
 * to child components through React Context.
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  /**
   * Load cart when user is authenticated and is a customer
   */
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'customer') {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  /**
   * Refresh cart data from API
   */
  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await mockCartApi.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add product to cart
   */
  const addToCart = async (product: Product, quantity: number = 1): Promise<void> => {
    if (!isAuthenticated || user?.role !== 'customer') {
      toast.error('Please sign in as a customer to add items to cart');
      return;
    }

    setLoading(true);
    try {
      const response = await mockCartApi.addToCart({
        productId: product.id,
        quantity,
      });
      setCart(response.data);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (itemId: string): Promise<void> => {
    if (!cart) return;

    setLoading(true);
    try {
      const response = await mockCartApi.removeFromCart(itemId);
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear cart (local state only)
   */
  const clearCart = (): void => {
    setCart(null);
  };

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const contextValue: CartContextType = {
    cart,
    itemCount,
    loading,
    addToCart,
    removeFromCart,
    refreshCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
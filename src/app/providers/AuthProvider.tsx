import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { User, AuthContextType, AuthAction } from './types';

/**
 * Authentication state interface
 */
interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

/**
 * Authentication reducer for managing auth state transitions
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication provider component props
 */
interface AuthProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Authentication provider that manages user authentication state
 * 
 * Features:
 * - Cookie-based session management
 * - Role-based access control (admin/customer)
 * - Persistent login state across browser sessions
 * - Mock authentication for POC purposes
 * 
 * @param props - Provider props containing children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Validates and restores user session from cookie
   */
  const restoreSession = useCallback((): void => {
    try {
      const userCookie = Cookies.get('walgreens_user');
      
      if (userCookie) {
        const user = JSON.parse(userCookie) as User;
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user },
        });
      } else {
        dispatch({
          type: 'AUTH_LOGOUT',
        });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: { error: 'Session restoration failed' },
      });
    }
  }, []);

  /**
   * Mock login function for POC
   * In production, this would make an API call to authenticate
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_LOADING' });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data based on email
      const mockUser: User = {
        id: email === 'admin@walgreens.com' ? 'admin-1' : 'customer-1',
        email,
        role: email === 'admin@walgreens.com' ? 'admin' : 'customer',
        firstName: email === 'admin@walgreens.com' ? 'Admin' : 'Customer',
        lastName: 'User',
      };

      // Mock authentication validation
      if (password === 'password123') {
        // Store user in cookie (7 days expiry)
        Cookies.set('walgreens_user', JSON.stringify(mockUser), { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: mockUser },
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: { error: errorMessage },
      });
    }
  }, []);

  /**
   * Logout function that clears user session
   */
  const logout = useCallback((): void => {
    Cookies.remove('walgreens_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: 'admin' | 'customer'): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  /**
   * Check if user has admin privileges
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  // Restore session on component mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
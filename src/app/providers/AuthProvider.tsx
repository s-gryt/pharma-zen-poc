import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthApi, User } from '@/shared/lib/api';
import { useLocalStorage } from '@/shared/hooks';
import { toast } from 'sonner';

/**
 * Authentication context interface
 */
interface AuthContextType {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly login: (email: string, password: string) => Promise<boolean>;
  readonly logout: () => void;
  readonly loading: boolean;
}

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
 * Authentication provider component
 * 
 * Manages user authentication state and provides authentication methods
 * to child components through React Context.
 * 
 * Features:
 * - User session management with persistence
 * - Login/logout functionality with mock API
 * - Authentication state persistence in localStorage
 * - Role-based access control
 * - Automatic session restoration on app load
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<string | null>('auth_token', null);
  const [userData, setUserData, removeUserData] = useLocalStorage<User | null>('user_data', null);

  /**
   * Initialize authentication state from localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Restore session from localStorage without calling mock API
        if (authToken && userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [authToken, userData]);

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await mockAuthApi.login({ email, password });
      const { user: authenticatedUser, token } = response.data;
      
      // Store authentication data
      setUser(authenticatedUser);
      setAuthToken(token);
      setUserData(authenticatedUser);
      
      toast.success(`Welcome back, ${authenticatedUser.firstName}!`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout current user and clear session
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await mockAuthApi.logout();
      
      // Clear all stored data
      setUser(null);
      removeAuthToken();
      removeUserData();
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
      removeAuthToken();
      removeUserData();
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = user !== null;

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
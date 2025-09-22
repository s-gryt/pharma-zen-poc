/**
 * User role type definition
 */
export type UserRole = 'admin' | 'customer';

/**
 * User interface representing authenticated user data
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly firstName: string;
  readonly lastName: string;
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly logout: () => void;
  readonly hasRole: (role: UserRole) => boolean;
  readonly isAdmin: () => boolean;
}

/**
 * Authentication action types for reducer
 */
export type AuthAction =
  | { readonly type: 'AUTH_LOADING' }
  | { readonly type: 'AUTH_SUCCESS'; readonly payload: { readonly user: User } }
  | { readonly type: 'AUTH_ERROR'; readonly payload: { readonly error: string } }
  | { readonly type: 'AUTH_LOGOUT' };
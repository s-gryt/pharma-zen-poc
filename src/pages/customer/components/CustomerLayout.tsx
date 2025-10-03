import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Home, Package, User } from 'lucide-react';
import { UserMenu } from '@/shared/components/navigation/UserMenu';
import { useAuth } from '@/app/providers/AuthProvider';
import { useCart } from '@/app/providers/CartProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Customer layout props interface
 */
interface CustomerLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Customer layout component providing customer-specific navigation and structure
 * 
 * Features:
 * - Top navigation bar with customer context
 * - Shopping cart access with item count
 * - User account menu with authentication state
 * - Responsive navigation design
 * - Clean, consumer-friendly interface
 * - Role-aware navigation options
 */
export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-walgreens-blue/20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <h1 
              className="text-2xl font-bold text-walgreens-red cursor-pointer hover:text-walgreens-red/80 transition-colors"
              onClick={() => navigate('/')}
            >
              Walgreens
            </h1>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-walgreens-blue hover:text-walgreens-red hover:bg-walgreens-light-blue/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => navigate('/products')}
                className="text-walgreens-blue hover:text-walgreens-red hover:bg-walgreens-light-blue/20"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </Button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cart')}
                className="relative text-walgreens-blue hover:text-walgreens-red hover:bg-walgreens-light-blue/20"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-walgreens-red"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Authentication */}
              {isAuthenticated && user ? (
                <UserMenu />
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="sm"
                  className="border-walgreens-red text-walgreens-red hover:bg-walgreens-red hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-walgreens-blue text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm opacity-90">
              © 2024 Walgreens. Built with clean architecture principles.
            </p>
            {user?.role === 'admin' && (
              <p className="text-walgreens-teal text-sm mt-2 font-medium">
                Admin Access Available
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
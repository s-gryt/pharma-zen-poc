import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Badge,
} from '@mui/material';
import { ShoppingCart, Home, Inventory } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/shared/components/navigation/UserMenu';
import { useAuth } from '@/app/providers/AuthProvider';

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

  // TODO: Replace with actual cart item count from cart state
  const cartItemCount = 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          backgroundColor: 'var(--card)', 
          color: 'var(--card-foreground)' 
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
            className="font-semibold"
          >
            Walgreens POC
          </Typography>

          {/* Navigation Links */}
          <Button 
            color="inherit" 
            startIcon={<Home />}
            onClick={() => navigate('/')}
            className="hidden sm:flex"
          >
            Home
          </Button>

          <Button 
            color="inherit" 
            startIcon={<Inventory />}
            onClick={() => navigate('/products')}
          >
            Products
          </Button>

          {/* Shopping Cart */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            aria-label={`shopping cart${cartItemCount > 0 ? ` with ${cartItemCount} items` : ''}`}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User Authentication */}
          {isAuthenticated && user ? (
            <UserMenu color="inherit" />
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              variant="outlined"
              size="small"
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-12">
        <Container maxWidth="lg" className="py-8">
          <div className="text-center">
            <Typography variant="body2" color="textSecondary">
              © 2024 Walgreens POC. Built with clean architecture principles.
            </Typography>
            {user?.role === 'admin' && (
              <Typography variant="caption" color="primary" className="block mt-2">
                Admin Access Available
              </Typography>
            )}
          </div>
        </Container>
      </footer>
    </div>
  );
};
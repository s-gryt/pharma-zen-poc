import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Search,
  Home,
  Store,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * Customer layout props interface
 */
interface CustomerLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Customer layout component providing consistent navigation and structure
 * 
 * Features:
 * - Top navigation bar with logo and menu
 * - User account menu
 * - Shopping cart indicator
 * - Active page highlighting
 * - Responsive design
 */
export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    handleAccountMenuClose();
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Store /> },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            className="cursor-pointer"
            onClick={() => navigate('/')}
            sx={{ flexGrow: 0, mr: 4 }}
          >
            Walgreens POC
          </Typography>

          {/* Navigation Items */}
          <div className="flex-1 flex space-x-4">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                variant={isActive(item.path) ? 'contained' : 'text'}
                size="medium"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/products')}
              aria-label="search products"
            >
              <Search />
            </IconButton>

            {/* Shopping Cart */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              aria-label="shopping cart"
            >
              <Badge badgeContent={0} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Account Menu */}
            <div>
              <IconButton
                color="inherit"
                onClick={handleAccountMenuOpen}
                aria-label="user account"
                aria-controls="account-menu"
                aria-haspopup="true"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAccountMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'account-button',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" color="textSecondary">
                    {user?.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="body2" color="textSecondary">
            © 2025 Walgreens POC. This is a demonstration application.
          </Typography>
        </div>
      </footer>
    </div>
  );
};
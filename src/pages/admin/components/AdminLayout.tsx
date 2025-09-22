import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * Admin layout props interface
 */
interface AdminLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Admin layout component providing admin-specific navigation and structure
 * 
 * Features:
 * - Side navigation drawer
 * - Top app bar with admin context
 * - User account menu
 * - Active page highlighting
 * - Responsive design
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

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

  const toggleDrawer = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/admin', icon: <Dashboard /> },
    { label: 'Products', path: '/admin/products', icon: <Inventory /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingCart /> },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Side Navigation Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
          },
        }}
      >
        <Toolbar />
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: isActive(item.path) ? 'var(--primary)' : 'transparent',
                color: isActive(item.path) ? 'var(--primary-foreground)' : 'inherit',
                '& .MuiListItemIcon-root': {
                  color: isActive(item.path) ? 'var(--primary-foreground)' : 'inherit',
                },
                '&:hover': {
                  backgroundColor: isActive(item.path) ? 'var(--primary)' : 'var(--muted)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <AppBar 
          position="static" 
          elevation={1}
          sx={{ 
            backgroundColor: 'var(--card)', 
            color: 'var(--card-foreground)',
            marginLeft: drawerOpen ? '240px' : 0,
            width: drawerOpen ? 'calc(100% - 240px)' : '100%',
            transition: 'margin-left 0.3s, width 0.3s',
          }}
        >
          <Toolbar>
            {/* Menu Toggle */}
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Walgreens POC - Admin
            </Typography>

            {/* User Account Menu */}
            <div>
              <IconButton
                color="inherit"
                onClick={handleAccountMenuOpen}
                aria-label="user account"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAccountMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" color="textSecondary">
                    Administrator
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <main 
          className="flex-1"
          style={{
            marginLeft: drawerOpen ? '240px' : 0,
            transition: 'margin-left 0.3s',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
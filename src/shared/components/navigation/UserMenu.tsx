/**
 * User menu component
 * 
 * Provides user account actions in a dropdown menu format.
 * Displays user information and logout functionality.
 * 
 * @fileoverview User account menu component
 */

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AccountCircle,
  Person,
  ExitToApp,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

/**
 * User menu component props
 */
interface UserMenuProps {
  /** Additional CSS classes */
  readonly className?: string;
  /** Color variant for the menu trigger */
  readonly color?: 'inherit' | 'primary' | 'secondary';
}

/**
 * User menu component providing account actions and user information
 * 
 * Features:
 * - User information display
 * - Role-based menu options
 * - Logout functionality
 * - Profile navigation (future enhancement)
 * - Responsive design
 * - Accessibility compliance
 * 
 * @example
 * ```tsx
 * <UserMenu color="inherit" />
 * ```
 */
export const UserMenu: React.FC<UserMenuProps> = ({ 
  className, 
  color = 'inherit' 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOpen = Boolean(anchorEl);

  /**
   * Open user menu
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close user menu
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  /**
   * Navigate to profile page
   */
  const handleProfile = () => {
    handleMenuClose();
    // TODO: Implement profile page navigation
    // navigate('/profile');
  };

  /**
   * Navigate to admin dashboard (admin only)
   */
  const handleAdminDashboard = () => {
    handleMenuClose();
    navigate('/admin');
  };

  if (!user) {
    return null;
  }

  return (
    <div className={className}>
      <IconButton
        size="large"
        color={color}
        onClick={handleMenuOpen}
        aria-label="user account menu"
        aria-controls={isOpen ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          <AccountCircle />
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Information Header */}
        <MenuItem disabled>
          <Avatar>
            <AccountCircle />
          </Avatar>
          <div>
            <Typography variant="subtitle2">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user.email}
            </Typography>
          </div>
        </MenuItem>
        
        <Divider />

        {/* Profile Action */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        {/* Admin Dashboard (Admin Only) */}
        {user.role === 'admin' && (
          <MenuItem onClick={handleAdminDashboard}>
            <ListItemIcon>
              <AdminPanelSettings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Admin Dashboard</ListItemText>
          </MenuItem>
        )}

        <Divider />

        {/* Logout Action */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
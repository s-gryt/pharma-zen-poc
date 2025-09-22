import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { LoginForm } from './components/LoginForm';

/**
 * Login form data interface
 */
interface LoginData {
  readonly email: string;
  readonly password: string;
}

/**
 * Login page component
 * 
 * Provides the main login interface for user authentication.
 * Handles login form submission and redirects authenticated users.
 * 
 * Features:
 * - Clean, centered login form with demo credentials
 * - Responsive design for all devices
 * - Integration with authentication system
 * - Automatic redirect after successful login
 * - Redirect to intended page after login
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  
  // Get the intended destination from location state
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  /**
   * Redirect authenticated users to their appropriate dashboard
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/login' ? '/' : from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  /**
   * Handle login form submission
   */
  const handleLogin = async (data: LoginData): Promise<boolean> => {
    const success = await login(data.email, data.password);
    
    if (success && user) {
      // Navigation will be handled by useEffect
      return true;
    }
    
    return false;
  };

  // Don't render login form if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <div className="text-center mb-8">
          <Typography variant="h3" component="h1" gutterBottom className="text-primary">
            Welcome to Walgreens
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Sign in to access your account and manage your health
          </Typography>
        </div>
        
        <LoginForm onSubmit={handleLogin} />
      </Container>
    </div>
  );
};

export default LoginPage;
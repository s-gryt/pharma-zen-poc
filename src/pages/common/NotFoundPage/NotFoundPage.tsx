import React from 'react';
import { Container, Typography, Button, Paper } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

/**
 * 404 Not Found page component
 * 
 * Features:
 * - User-friendly error message
 * - Navigation back to appropriate home page based on role
 * - Browser back button
 * - Responsive design
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoHome = (): void => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const homePath = user?.role === 'admin' ? '/admin' : '/';
    navigate(homePath);
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={2} className="p-8 text-center">
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'var(--muted-foreground)' }}
            gutterBottom
          >
            404
          </Typography>
          
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="textSecondary" className="mb-8">
            The page you're looking for doesn't exist or has been moved.
          </Typography>

          <div className="space-x-4">
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
              className="mr-4"
            >
              Go Home
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default NotFoundPage;
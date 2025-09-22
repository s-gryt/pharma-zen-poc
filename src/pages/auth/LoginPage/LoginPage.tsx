import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { LoginForm } from './components/LoginForm';

/**
 * Login page component
 * 
 * Provides user authentication interface with:
 * - Email/password form
 * - Mock authentication for POC
 * - Role-based redirect after login
 * - Responsive design
 */
const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper 
          elevation={2} 
          className="p-8"
          sx={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
          }}
        >
          <div className="text-center mb-8">
            <Typography variant="h4" component="h1" gutterBottom>
              Walgreens POC
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign in to continue
            </Typography>
          </div>
          
          <LoginForm />
          
          <div className="mt-6 p-4 bg-secondary rounded-md">
            <Typography variant="body2" className="text-secondary-foreground">
              <strong>Demo Credentials:</strong><br />
              Admin: admin@walgreens.com / password123<br />
              Customer: customer@walgreens.com / password123
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
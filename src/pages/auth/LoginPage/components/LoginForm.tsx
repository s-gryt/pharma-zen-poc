import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Paper, Typography, Box, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormField } from '@/shared/components/ui';

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Login form data interface
 */
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login form props interface
 */
interface LoginFormProps {
  readonly onSubmit: (data: LoginFormData) => Promise<boolean>;
  readonly loading?: boolean;
}

/**
 * Login form component
 * 
 * Provides a clean, accessible login form with validation
 * and error handling for user authentication.
 * 
 * Features:
 * - Form validation with Zod schema validation
 * - Material UI design consistency
 * - Loading states during authentication
 * - Error handling and user feedback
 * - Accessibility compliance
 * - Demo credentials helper
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData): Promise<void> => {
    const success = await onSubmit(data);
    
    if (!success) {
      setError('root', {
        type: 'manual',
        message: 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <Paper elevation={3} className="p-8 max-w-md mx-auto">
      <Typography variant="h4" component="h1" className="mb-6 text-center">
        Sign In to Walgreens
      </Typography>
      
      {/* Demo Credentials Alert */}
      <Alert severity="info" className="mb-4">
        <Typography variant="body2" className="mb-2">
          <strong>Demo Credentials:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Admin:</strong> admin@walgreens.com / admin123<br />
          <strong>Customer:</strong> customer@example.com / customer123
        </Typography>
      </Alert>
      
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Root error display */}
        {errors.root && (
          <Alert severity="error" className="mb-4">
            {errors.root.message}
          </Alert>
        )}
        
        <FormField
          label="Email Address"
          type="email"
          required
          error={errors.email?.message}
          registration={register('email')}
          className="mb-4"
        />
        
        <FormField
          label="Password"
          type="password"
          required
          error={errors.password?.message}
          registration={register('password')}
          className="mb-6"
        />
        
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={loading}
          loadingIndicator="Signing In..."
          className="mt-4"
        >
          Sign In
        </LoadingButton>
      </Box>
    </Paper>
  );
};
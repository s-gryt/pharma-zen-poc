import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '@/app/providers/AuthProvider';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

/**
 * Login form state interface
 */
interface LoginFormState {
  readonly email: string;
  readonly password: string;
  readonly showPassword: boolean;
}

/**
 * Initial form state
 */
const initialState: LoginFormState = {
  email: '',
  password: '',
  showPassword: false,
};

/**
 * Login form component with validation and error handling
 * 
 * Features:
 * - Email and password validation
 * - Password visibility toggle
 * - Loading states during authentication
 * - Error display for failed attempts
 * - Keyboard navigation support
 */
export const LoginForm: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>(initialState);
  const { login, isLoading, error } = useAuth();

  /**
   * Updates form field values
   */
  const updateField = useCallback((field: keyof LoginFormState) => 
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormState(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    }, []
  );

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = useCallback((): void => {
    setFormState(prev => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    
    if (!formState.email.trim() || !formState.password.trim()) {
      return;
    }

    try {
      await login(formState.email.trim(), formState.password);
    } catch (error) {
      // Error is handled by AuthProvider and displayed via context
      console.error('Login failed:', error);
    }
  }, [formState.email, formState.password, login]);

  /**
   * Validates email format
   */
  const isEmailValid = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length === 0 || emailRegex.test(email);
  }, []);

  /**
   * Checks if form is valid for submission
   */
  const isFormValid = formState.email.trim().length > 0 && 
                     formState.password.length > 0 && 
                     isEmailValid(formState.email);

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <TextField
          fullWidth
          type="email"
          label="Email Address"
          value={formState.email}
          onChange={updateField('email')}
          error={formState.email.length > 0 && !isEmailValid(formState.email)}
          helperText={
            formState.email.length > 0 && !isEmailValid(formState.email)
              ? 'Please enter a valid email address'
              : ''
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          autoComplete="email"
          required
          disabled={isLoading}
        />

        <TextField
          fullWidth
          type={formState.showPassword ? 'text' : 'password'}
          label="Password"
          value={formState.password}
          onChange={updateField('password')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                  disabled={isLoading}
                >
                  {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="current-password"
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isFormValid || isLoading}
          className="mt-6"
          startIcon={isLoading ? <LoadingSpinner size="small" /> : undefined}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};
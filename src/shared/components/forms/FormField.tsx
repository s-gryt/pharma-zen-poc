/**
 * Reusable form field component
 * 
 * Provides consistent form field styling and error handling
 * across the application with Material UI integration.
 * 
 * @fileoverview Generic form field component
 */

import React from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

/**
 * Form field component props
 */
export interface FormFieldProps {
  /** Field label */
  readonly label: string;
  /** Field type (text, email, password, etc.) */
  readonly type?: string;
  /** Placeholder text */
  readonly placeholder?: string;
  /** Whether field is required */
  readonly required?: boolean;
  /** Whether field is disabled */
  readonly disabled?: boolean;
  /** Field error message */
  readonly error?: string;
  /** Help text */
  readonly helperText?: string;
  /** React Hook Form registration */
  readonly registration?: UseFormRegisterReturn;
  /** Additional CSS classes */
  readonly className?: string;
  /** Multiline textarea mode */
  readonly multiline?: boolean;
  /** Number of rows for textarea */
  readonly rows?: number;
  /** Start adornment */
  readonly startAdornment?: React.ReactNode;
  /** End adornment */
  readonly endAdornment?: React.ReactNode;
}

/**
 * Reusable form field component with consistent styling
 * and error handling across the application
 * 
 * Features:
 * - Consistent Material UI styling
 * - React Hook Form integration
 * - Error state handling
 * - Accessibility features
 * - Flexible input types
 * 
 * @example
 * ```tsx
 * <FormField
 *   label="Email Address"
 *   type="email"
 *   required
 *   error={errors.email?.message}
 *   registration={register('email')}
 * />
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  registration,
  className,
  multiline = false,
  rows = 4,
  startAdornment,
  endAdornment,
}) => {
  const hasError = Boolean(error);

  return (
    <div className={className}>
      <TextField
        {...registration}
        label={label}
        type={multiline ? undefined : type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={hasError}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        fullWidth
        variant="outlined"
        margin="normal"
        InputProps={{
          startAdornment,
          endAdornment,
        }}
        // Accessibility attributes
        aria-describedby={
          error ? `${registration?.name}-error` : 
          helperText ? `${registration?.name}-helper` : undefined
        }
        aria-invalid={hasError}
      />
      
      {/* Error message */}
      {error && (
        <FormHelperText 
          error 
          id={`${registration?.name}-error`}
          className="mt-1"
        >
          {error}
        </FormHelperText>
      )}
      
      {/* Helper text (only shown when no error) */}
      {helperText && !error && (
        <FormHelperText 
          id={`${registration?.name}-helper`}
          className="mt-1"
        >
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};
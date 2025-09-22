/**
 * Reusable form select component
 * 
 * Provides consistent select field styling and functionality
 * with Material UI integration and React Hook Form support.
 * 
 * @fileoverview Generic form select component
 */

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

/**
 * Select option interface
 */
export interface SelectOption {
  readonly value: string | number;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Form select component props
 */
export interface FormSelectProps {
  /** Field label */
  readonly label: string;
  /** Available options */
  readonly options: readonly SelectOption[];
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
  /** Placeholder text */
  readonly placeholder?: string;
  /** Allow multiple selections */
  readonly multiple?: boolean;
}

/**
 * Reusable form select component with consistent styling
 * and error handling across the application
 * 
 * Features:
 * - Consistent Material UI styling
 * - React Hook Form integration
 * - Error state handling
 * - Accessibility features
 * - Single and multiple selection modes
 * 
 * @example
 * ```tsx
 * <FormSelect
 *   label="Product Category"
 *   options={[
 *     { value: 'pharmacy', label: 'Pharmacy' },
 *     { value: 'health', label: 'Health & Wellness' },
 *   ]}
 *   required
 *   error={errors.category?.message}
 *   registration={register('category')}
 * />
 * ```
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  required = false,
  disabled = false,
  error,
  helperText,
  registration,
  className,
  placeholder,
  multiple = false,
}) => {
  const hasError = Boolean(error);
  const fieldId = `select-${registration?.name || 'field'}`;
  const labelId = `${fieldId}-label`;

  return (
    <div className={className}>
      <FormControl 
        fullWidth 
        margin="normal" 
        error={hasError}
        required={required}
        disabled={disabled}
      >
        <InputLabel id={labelId}>
          {label}
        </InputLabel>
        <Select
          {...registration}
          labelId={labelId}
          id={fieldId}
          label={label}
          multiple={multiple}
          displayEmpty={Boolean(placeholder)}
          aria-describedby={
            error ? `${fieldId}-error` : 
            helperText ? `${fieldId}-helper` : undefined
          }
          aria-invalid={hasError}
        >
          {/* Placeholder option */}
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          
          {/* Options */}
          {options.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        
        {/* Error message */}
        {error && (
          <FormHelperText id={`${fieldId}-error`}>
            {error}
          </FormHelperText>
        )}
        
        {/* Helper text (only shown when no error) */}
        {helperText && !error && (
          <FormHelperText id={`${fieldId}-helper`}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};
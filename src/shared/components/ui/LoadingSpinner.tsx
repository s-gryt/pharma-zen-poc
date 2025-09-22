import React, { memo } from 'react';
import { CircularProgress } from '@mui/material';
import type { LoadingSpinnerProps } from './types';

/**
 * Reusable loading spinner component
 * 
 * @param props - Component props
 * @returns Loading spinner JSX element
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="medium" />
 * <LoadingSpinner size="small" color="primary" />
 * ```
 */
export const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'medium',
  color = 'primary',
  className = '',
  ...restProps
}) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
  };

  return (
    <CircularProgress
      size={sizeMap[size]}
      color={color}
      className={className}
      {...restProps}
    />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
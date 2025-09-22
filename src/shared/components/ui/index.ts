/**
 * Shared UI components entry point
 * 
 * Exports all reusable UI components for use across the application.
 * 
 * @fileoverview Shared UI components public interface
 */

export { LoadingSpinner } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './types';

// Re-export form components
export { FormField, FormSelect } from '../forms';
export type { FormFieldProps, FormSelectProps, SelectOption } from '../forms';

// Re-export navigation components
export { UserMenu } from '../navigation/UserMenu';

// Re-export feedback components
export { ErrorBoundary, useErrorHandler } from '../feedback/ErrorBoundary';
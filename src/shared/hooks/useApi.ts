/**
 * API interaction hook
 * 
 * Provides a standardized way to handle API calls with loading states,
 * error handling, and automatic retries.
 * 
 * @fileoverview Generic API interaction hook
 */

import { useState, useCallback } from 'react';
import { ApiResponse, ApiClientError } from '../lib/api';

/**
 * API hook state interface
 */
interface ApiState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

/**
 * API hook options
 */
interface UseApiOptions {
  /** Show loading state immediately on mount */
  readonly immediate?: boolean;
  /** Number of retry attempts on failure */
  readonly retries?: number;
  /** Delay between retries in milliseconds */
  readonly retryDelay?: number;
}

/**
 * API hook return interface
 */
interface UseApiReturn<T> extends ApiState<T> {
  /** Execute the API call */
  readonly execute: () => Promise<T | null>;
  /** Reset the state */
  readonly reset: () => void;
}

/**
 * Generic hook for handling API calls with loading states and error handling
 * 
 * Features:
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Automatic retry logic
 * - State reset functionality
 * - TypeScript support for response data
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi(
 *   () => mockProductsApi.getProducts(),
 *   { immediate: true }
 * );
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} />;
 * return <ProductList products={data} />;
 * ```
 */
export const useApi = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const { immediate = false, retries = 0, retryDelay = 1000 } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  /**
   * Execute API call with retry logic
   */
  const executeWithRetry = useCallback(
    async (attempt: number = 0): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiCall();
        
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          error: null,
        }));

        return response.data;
      } catch (error) {
        const errorMessage = error instanceof ApiClientError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred';

        // Retry logic
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return executeWithRetry(attempt + 1);
        }

        setState(prev => ({
          ...prev,
          data: null,
          loading: false,
          error: errorMessage,
        }));

        return null;
      }
    },
    [apiCall, retries, retryDelay]
  );

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute: executeWithRetry,
    reset,
  };
};

/**
 * Hook for handling mutations (POST, PUT, DELETE operations)
 * 
 * Similar to useApi but designed for data mutations with different
 * default behavior (no immediate execution).
 * 
 * @example
 * ```tsx
 * const { loading, error, execute } = useMutation(
 *   (data) => mockProductsApi.createProduct(data)
 * );
 * 
 * const handleSubmit = async (formData) => {
 *   const result = await execute(formData);
 *   if (result) {
 *     // Handle success
 *   }
 * };
 * ```
 */
export const useMutation = <TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: Omit<UseApiOptions, 'immediate'> = {}
) => {
  const [state, setState] = useState<ApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const { retries = 0, retryDelay = 1000 } = options;

  /**
   * Execute mutation with retry logic
   */
  const execute = useCallback(
    async (variables: TVariables, attempt: number = 0): Promise<TData | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await mutationFn(variables);
        
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          error: null,
        }));

        return response.data;
      } catch (error) {
        const errorMessage = error instanceof ApiClientError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred';

        // Retry logic
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return execute(variables, attempt + 1);
        }

        setState(prev => ({
          ...prev,
          data: null,
          loading: false,
          error: errorMessage,
        }));

        return null;
      }
    },
    [mutationFn, retries, retryDelay]
  );

  /**
   * Reset mutation state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
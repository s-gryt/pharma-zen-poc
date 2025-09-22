/**
 * Error boundary component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * @fileoverview React error boundary for graceful error handling
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Typography, Button, Alert, Box } from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';

/**
 * Error boundary props interface
 */
interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error?: Error;
  readonly errorInfo?: ErrorInfo;
}

/**
 * Error boundary component for graceful error handling
 * 
 * Features:
 * - Catches and handles React component errors
 * - Displays user-friendly error messages
 * - Provides recovery actions (refresh, navigate home)
 * - Logs errors for debugging
 * - Customizable fallback UI
 * - Prevents entire app crashes
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details and call custom error handler
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // TODO: Send error to monitoring service (e.g., Sentry)
    // this.reportErrorToService(error, errorInfo);
  }

  /**
   * Reload the current page
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * Navigate to home page
   */
  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  /**
   * Reset error boundary state
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" className="py-12">
          <Box className="text-center">
            <Alert severity="error" className="mb-6">
              <Typography variant="h5" component="h1" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" className="mb-4">
                We encountered an unexpected error. This has been logged and our team will investigate.
              </Typography>
            </Alert>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert severity="warning" className="mb-6 text-left">
                <Typography variant="h6" gutterBottom>
                  Error Details (Development Mode)
                </Typography>
                <Typography variant="body2" component="pre" className="whitespace-pre-wrap">
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="body2" component="pre" className="whitespace-pre-wrap mt-2">
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Alert>
            )}

            {/* Recovery Actions */}
            <Box className="space-x-4">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                size="large"
              >
                Reload Page
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go Home
              </Button>

              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="text"
                  onClick={this.handleReset}
                  size="large"
                >
                  Reset Error
                </Button>
              )}
            </Box>

            {/* Contact Information */}
            <Typography variant="body2" color="textSecondary" className="mt-8">
              If this problem persists, please contact support with the error details above.
            </Typography>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for throwing errors in functional components
 * Useful for testing error boundaries
 * 
 * @example
 * ```tsx
 * const throwError = useErrorHandler();
 * 
 * const handleClick = () => {
 *   throwError(new Error('Test error'));
 * };
 * ```
 */
export const useErrorHandler = () => {
  return (error: Error) => {
    throw error;
  };
};
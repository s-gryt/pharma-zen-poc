import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, CartProvider } from './providers';
import { AppRouter } from './router/AppRouter';
import { theme } from './theme/muiTheme';
import { ErrorBoundary } from '@/shared/components/ui';

/**
 * Query client configuration for React Query
 * Configured with reasonable defaults for caching and error handling
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Root application component
 * 
 * Sets up the application with all necessary providers and routing.
 * Follows the provider pattern for clean dependency injection.
 * 
 * Provider hierarchy:
 * 1. ErrorBoundary - Global error handling
 * 2. QueryClientProvider - React Query for server state
 * 3. BrowserRouter - Routing context
 * 4. ThemeProvider - Material UI theming
 * 5. AuthProvider - Authentication state
 * 6. Toaster - Global toast notifications
 * 7. AppRouter - Route definitions and navigation
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <CartProvider>
                <Toaster 
                  position="top-right"
                  richColors
                  closeButton
                  duration={4000}
                />
                <AppRouter />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
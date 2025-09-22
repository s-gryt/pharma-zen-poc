import { createTheme } from '@mui/material/styles';

/**
 * Material UI theme configuration
 * 
 * Integrates with Tailwind CSS design tokens for consistent styling.
 * Uses CSS custom properties defined in index.css for colors.
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(222.2, 47.4%, 11.2%)', // --primary
      contrastText: 'hsl(210, 40%, 98%)', // --primary-foreground
    },
    secondary: {
      main: 'hsl(210, 40%, 96.1%)', // --secondary
      contrastText: 'hsl(222.2, 47.4%, 11.2%)', // --secondary-foreground
    },
    error: {
      main: 'hsl(0, 84.2%, 60.2%)', // --destructive
      contrastText: 'hsl(210, 40%, 98%)', // --destructive-foreground
    },
    background: {
      default: 'hsl(0, 0%, 100%)', // --background
      paper: 'hsl(0, 0%, 100%)', // --card
    },
    text: {
      primary: 'hsl(222.2, 84%, 4.9%)', // --foreground
      secondary: 'hsl(215.4, 16.3%, 46.9%)', // --muted-foreground
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8, // Matches --radius (0.5rem)
  },
  components: {
    // Customize Material UI components to match design system
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'calc(var(--radius) - 2px)',
            '& fieldset': {
              borderColor: 'hsl(var(--border))',
            },
            '&:hover fieldset': {
              borderColor: 'hsl(var(--ring))',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'hsl(var(--ring))',
            },
          },
        },
      },
    },
  },
});

/**
 * Dark theme configuration
 * Will be used when dark mode is implemented
 */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(210, 40%, 98%)', // --primary (dark)
      contrastText: 'hsl(222.2, 47.4%, 11.2%)', // --primary-foreground (dark)
    },
    secondary: {
      main: 'hsl(217.2, 32.6%, 17.5%)', // --secondary (dark)
      contrastText: 'hsl(210, 40%, 98%)', // --secondary-foreground (dark)
    },
    error: {
      main: 'hsl(0, 62.8%, 30.6%)', // --destructive (dark)
      contrastText: 'hsl(210, 40%, 98%)', // --destructive-foreground (dark)
    },
    background: {
      default: 'hsl(222.2, 84%, 4.9%)', // --background (dark)
      paper: 'hsl(222.2, 84%, 4.9%)', // --card (dark)
    },
    text: {
      primary: 'hsl(210, 40%, 98%)', // --foreground (dark)
      secondary: 'hsl(215, 20.2%, 65.1%)', // --muted-foreground (dark)
    },
  },
  // ... rest of theme configuration
});

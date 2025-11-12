import { createTheme } from '@mui/material/styles';

// GitHub Dark Theme colors (approximate)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58a6ff', // GitHub blue for links/buttons
    },
    secondary: {
      main: '#238636', // GitHub green for primary actions
    },
    background: {
      default: '#0d1117', // Main background (very dark blue-grey)
      paper: '#161b22', // Card/Panel background (slightly lighter)
    },
    text: {
      primary: '#c9d1d9', // Main text (light grey)
      secondary: '#8b949e', // Secondary text (grey)
    },
    divider: '#30363d', // Border color
    error: {
      main: '#f85149', // Red for errors
    },
    success: {
      main: '#2ea043', // Green for success states
    },
    warning: {
      main: '#d29922', // Orange for warnings
    },
    info: {
      main: '#58a6ff', // Blue for info
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Helvetica',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // GitHub buttons are not all-caps
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 6, // Slightly rounded corners like GitHub
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          color: '#ffffff', // White text on primary buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22', // Darker header
          backgroundImage: 'none', // Remove default MUI gradient
          borderBottom: '1px solid #30363d',
          boxShadow: 'none', // Flat header
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #30363d',
          boxShadow: 'none', // Flat cards
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default MUI overlay for dark mode
        },
        outlined: {
          border: '1px solid #30363d',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#30363d',
            },
            '&:hover fieldset': {
              borderColor: '#8b949e',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#58a6ff', // Focus color
            },
          },
        },
      },
    },
  },
});

export default theme;
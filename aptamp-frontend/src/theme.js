import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0057A8',      // AP Blue
      light: '#3d7fc1',
      dark: '#003366',       // AP Navy
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F4A300',      // AP Gold
      light: '#f6b733',
      dark: '#d4890a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FA',   // AP Light Gray
      paper: '#ffffff',
    },
    text: {
      primary: '#2C3E50',   // AP Dark Gray
      secondary: '#5D6D7E',
      disabled: '#94a3b8',
    },
    error: {
      main: '#C0392B',      // AP Red
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF6600',      // AP Saffron
      contrastText: '#ffffff',
    },
    success: {
      main: '#27AE60',      // AP Green
      contrastText: '#ffffff',
    },
    divider: '#D1D9E0',     // AP Border
  },
  typography: {
    fontFamily: "'Noto Sans', 'Inter', 'Noto Sans Telugu', sans-serif",
    h1: {
      fontFamily: "'Noto Serif', Georgia, serif",
      fontWeight: 700,
      color: '#003366',
    },
    h2: {
      fontFamily: "'Noto Serif', Georgia, serif",
      fontWeight: 700,
      color: '#003366',
    },
    h3: {
      fontFamily: "'Noto Serif', Georgia, serif",
      fontWeight: 600,
      color: '#003366',
    },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4, // Government statutory visual styling
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#0057A8',
          '&:hover': {
            backgroundColor: '#003366',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #D1D9E0',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#003366',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
  },
});

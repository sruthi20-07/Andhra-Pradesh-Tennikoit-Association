import { createTheme } from '@mui/material/styles';

/**
 * APTAMP Government-Grade Accessible UI Theme
 * Designed according to WCAG 2.1 AA and AAA standards for contrast, legibility, and usability.
 * Styled to resemble a National Sports Federation / Ministry of Sports / Olympic Association Portal.
 */
export const theme = createTheme({
  // Responsive Breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  
  // Stately Government Color Palette
  palette: {
    mode: 'light',
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
      dark: '#7f1d1d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF6600',      // AP Saffron
      dark: '#7c2d12',
      contrastText: '#ffffff',
    },
    success: {
      main: '#27AE60',      // AP Green
      dark: '#14532d',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0057A8',
      dark: '#003366',
      contrastText: '#ffffff',
    },
    divider: '#D1D9E0',     // AP Border
  },

  // Accessible Typography Hierarchy
  typography: {
    fontFamily: "'Noto Sans', 'Inter', 'Noto Sans Telugu', system-ui, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      fontFamily: "'Noto Serif', 'Noto Serif Telugu', Georgia, serif",
      color: '#003366', // AP Navy
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      fontFamily: "'Noto Serif', 'Noto Serif Telugu', Georgia, serif",
      color: '#003366',
      '@media (max-width:600px)': {
        fontSize: '1.6rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.6rem',
      lineHeight: 1.3,
      fontFamily: "'Noto Serif', 'Noto Serif Telugu', Georgia, serif",
      color: '#003366',
      '@media (max-width:600px)': {
        fontSize: '1.35rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.35rem',
      lineHeight: 1.35,
      fontFamily: "'Noto Serif', 'Noto Serif Telugu', Georgia, serif",
      color: '#003366',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.15rem',
      lineHeight: 1.4,
      fontFamily: "'Noto Serif', 'Noto Serif Telugu', Georgia, serif",
      color: '#003366',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.45,
      fontFamily: "'Noto Serif', 'Noto Serif Telugu', Georgia, serif",
      color: '#003366',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
      color: '#2C3E50',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.55,
      letterSpacing: '0.01071em',
      color: '#5D6D7E',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600,
    },
  },

  // Component Overrides for Government Portal Aesthetic & Accessibility
  components: {
    // 1. Buttons
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Flat design matching official portals
      },
      styleOverrides: {
        root: {
          borderRadius: 4,      // Stately sharp corners
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:focus-visible': {
            outline: '3px solid #F4A300', // High-visibility gold focus ring
            outlineOffset: '2px',
          },
        },
        containedPrimary: {
          backgroundColor: '#0057A8',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#003366',
          },
        },
        containedSecondary: {
          backgroundColor: '#F4A300',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#d4890a',
          },
        },
        outlinedPrimary: {
          borderWidth: '2px',
          borderColor: '#0057A8',
          color: '#0057A8',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(0, 87, 168, 0.04)',
            borderColor: '#003366',
          },
        },
      },
    },

    // 2. Form Inputs & Text Fields
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#ffffff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5D6D7E',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: '#0057A8', // High visibility outline on focus
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2.5px', // Thicker line for error recognition
          },
        },
        input: {
          padding: '12.5px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#5D6D7E',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#0057A8',
          },
        },
      },
    },

    // 3. Tables - Institutional Grade Styles
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '1px solid #D1D9E0',
          borderRadius: 4,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#003366', // Deep navy table header
          '& .MuiTableCell-head': {
            color: '#ffffff',        // High contrast text
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:nth-of-type(even)': {
            backgroundColor: '#F5F7FA', // Alternating row color
          },
          '&:hover': {
            backgroundColor: '#f1f5f9 !important', // Hover state
          },
          '&.Mui-selected': {
            backgroundColor: '#e2e8f0',
            '&:hover': {
              backgroundColor: '#cbd5e1',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '14px 16px',
          borderColor: '#D1D9E0',
          fontSize: '0.875rem',
        },
      },
    },

    // 4. Cards - Clean flat institutional outlines
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '1px solid #D1D9E0', // Explicit borders instead of heavy dropshadows
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 51, 102, 0.1)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          backgroundColor: '#F5F7FA',
          borderBottom: '1px solid #D1D9E0',
          '& .MuiCardHeader-title': {
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#003366',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },

    // 5. Dialogs & Modals
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
          border: '1px solid #D1D9E0',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#003366',
          color: '#ffffff',
          fontWeight: 700,
          padding: '16px 24px',
          fontSize: '1.25rem',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderTop: '1px solid #D1D9E0',
          backgroundColor: '#F5F7FA',
        },
      },
    },

    // 6. Form helper message contrast adjustment
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          marginTop: '6px',
          color: '#475569',
          '&.Mui-error': {
            color: '#b91c1c',
            fontWeight: 500,
          },
        },
      },
    },

    // 7. Chip elements
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
        },
      },
    },
  },
});

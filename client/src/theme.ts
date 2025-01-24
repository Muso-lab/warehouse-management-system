// client/src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B3C73',
    },
    secondary: {
      main: '#F7941D',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.813rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.813rem',
          padding: '8px 16px',
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid rgba(224, 224, 224, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
        sizeSmall: {
          height: '24px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
        },
        containedSizeSmall: {
          padding: '4px 8px',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '0.813rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.813rem',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          minWidth: '120px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;

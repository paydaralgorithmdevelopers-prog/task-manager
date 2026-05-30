'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors, typography, borderRadius, shadows } from './colors';

// Dark Theme Configuration
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.dark.accent.primary,
      light: colors.dark.accent.primaryHover,
      dark: '#2563EB',
      contrastText: colors.dark.text.inverse,
    },
    secondary: {
      main: colors.dark.accent.secondary,
      light: colors.dark.accent.secondaryHover,
      dark: '#7C3AED',
      contrastText: colors.dark.text.inverse,
    },
    error: {
      main: colors.dark.semantic.error.default,
      light: colors.dark.semantic.error.text,
      dark: colors.dark.semantic.error.hover,
    },
    warning: {
      main: colors.dark.semantic.warning.default,
      light: colors.dark.semantic.warning.text,
      dark: colors.dark.semantic.warning.hover,
    },
    info: {
      main: colors.dark.semantic.info.default,
      light: colors.dark.semantic.info.text,
      dark: colors.dark.semantic.info.hover,
    },
    success: {
      main: colors.dark.semantic.success.default,
      light: colors.dark.semantic.success.text,
      dark: colors.dark.semantic.success.hover,
    },
    background: {
      default: colors.dark.bg.primary,
      paper: colors.dark.bg.tertiary,
    },
    text: {
      primary: colors.dark.text.primary,
      secondary: colors.dark.text.secondary,
      disabled: colors.dark.text.tertiary,
    },
    divider: colors.dark.border.default,
  },
  typography: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },
    h3: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
    },
    h4: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    h5: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    h6: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    body1: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.normal,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.normal,
    },
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: parseInt(borderRadius.md.replace('rem', '')) * 16,
  },
  shadows: [
    'none',
    shadows.sm,
    shadows.md,
    shadows.md,
    shadows.lg,
    shadows.lg,
    shadows.xl,
    shadows.xl,
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.dark.border.strong} ${colors.dark.bg.primary}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: colors.dark.border.strong,
            minHeight: 24,
            '&:hover': {
              backgroundColor: colors.dark.border.focus,
            },
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: colors.dark.bg.primary,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          textTransform: 'none',
          fontWeight: typography.fontWeight.medium,
          padding: '8px 16px',
          transition: 'all 150ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: shadows.sm,
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
        outlined: {
          borderColor: colors.dark.border.default,
          '&:hover': {
            borderColor: colors.dark.border.strong,
            backgroundColor: colors.dark.bg.hover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.dark.bg.tertiary,
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.dark.border.subtle}`,
          transition: 'all 250ms ease',
          '&:hover': {
            borderColor: colors.dark.border.default,
            boxShadow: shadows.lg,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.dark.bg.tertiary,
          borderRadius: borderRadius.lg,
        },
        elevation1: {
          boxShadow: shadows.md,
        },
        elevation2: {
          boxShadow: shadows.lg,
        },
        elevation3: {
          boxShadow: shadows.xl,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: colors.dark.bg.secondary,
            transition: 'all 150ms ease',
            '&:hover': {
              backgroundColor: colors.dark.bg.hover,
            },
            '&.Mui-focused': {
              backgroundColor: colors.dark.bg.tertiary,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          fontWeight: typography.fontWeight.medium,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: colors.dark.bg.elevated,
          borderRadius: borderRadius.xl,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.dark.bg.secondary,
          borderRight: `1px solid ${colors.dark.border.subtle}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.dark.bg.tertiary,
          backgroundImage: 'none',
          borderBottom: `1px solid ${colors.dark.border.subtle}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.dark.bg.elevated,
          border: `1px solid ${colors.dark.border.default}`,
          borderRadius: borderRadius.md,
          fontSize: typography.fontSize.xs,
          padding: '6px 12px',
        },
        arrow: {
          color: colors.dark.bg.elevated,
          '&::before': {
            border: `1px solid ${colors.dark.border.default}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.dark.border.subtle}`,
        },
        head: {
          fontWeight: typography.fontWeight.semibold,
          backgroundColor: colors.dark.bg.secondary,
        },
      },
    },
  },
};

// Light Theme Configuration
const lightThemeOptions: ThemeOptions = {
  ...darkThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: colors.light.accent.primary,
      light: colors.light.accent.primaryHover,
      dark: '#1E40AF',
      contrastText: colors.light.text.inverse,
    },
    secondary: {
      main: colors.light.accent.secondary,
      light: colors.light.accent.secondaryHover,
      dark: '#6D28D9',
      contrastText: colors.light.text.inverse,
    },
    error: {
      main: colors.light.semantic.error.default,
      light: colors.light.semantic.error.text,
      dark: colors.light.semantic.error.hover,
    },
    warning: {
      main: colors.light.semantic.warning.default,
      light: colors.light.semantic.warning.text,
      dark: colors.light.semantic.warning.hover,
    },
    info: {
      main: colors.light.semantic.info.default,
      light: colors.light.semantic.info.text,
      dark: colors.light.semantic.info.hover,
    },
    success: {
      main: colors.light.semantic.success.default,
      light: colors.light.semantic.success.text,
      dark: colors.light.semantic.success.hover,
    },
    background: {
      default: colors.light.bg.primary,
      paper: colors.light.bg.tertiary,
    },
    text: {
      primary: colors.light.text.primary,
      secondary: colors.light.text.secondary,
      disabled: colors.light.text.tertiary,
    },
    divider: colors.light.border.default,
  },
  components: {
    ...darkThemeOptions.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.light.border.strong} ${colors.light.bg.primary}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: colors.light.border.strong,
            minHeight: 24,
            '&:hover': {
              backgroundColor: colors.light.border.focus,
            },
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: colors.light.bg.primary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.light.bg.tertiary,
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.light.border.subtle}`,
          transition: 'all 250ms ease',
          '&:hover': {
            borderColor: colors.light.border.default,
            boxShadow: shadows.lg,
          },
        },
      },
    },
  },
};

// Export theme creators
export const darkTheme = createTheme(darkThemeOptions);
export const lightTheme = createTheme(lightThemeOptions);

// Helper function to get theme based on mode
export const getTheme = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

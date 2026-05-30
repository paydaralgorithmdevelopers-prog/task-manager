// Design System Colors - Premium Dark-first Theme
// Inspired by: Linear, GitHub, Raycast, Vercel, Notion

export const colors = {
  // Dark Mode Colors (Primary)
  dark: {
    // Background levels
    bg: {
      primary: '#0A0A0A',       // Main background
      secondary: '#111111',     // Secondary background
      tertiary: '#171717',      // Tertiary background (cards, dialogs)
      elevated: '#1C1C1C',      // Elevated surfaces
      hover: '#222222',         // Hover state
    },
    // Surface colors
    surface: {
      base: '#171717',
      elevated: '#1F1F1F',
      overlay: '#252525',
    },
    // Border colors
    border: {
      subtle: '#262626',
      default: '#2E2E2E',
      strong: '#3F3F3F',
      focus: '#4C8BF5',
    },
    // Text colors
    text: {
      primary: '#F5F5F5',       // Primary text
      secondary: '#A1A1A1',     // Secondary text
      tertiary: '#737373',      // Tertiary text / disabled
      inverse: '#0A0A0A',       // Text on colored backgrounds
      link: '#4C8BF5',          // Link color
    },
    // Semantic colors
    semantic: {
      success: {
        default: '#10B981',
        hover: '#059669',
        bg: '#064E3B',
        text: '#6EE7B7',
      },
      warning: {
        default: '#F59E0B',
        hover: '#D97706',
        bg: '#78350F',
        text: '#FCD34D',
      },
      error: {
        default: '#EF4444',
        hover: '#DC2626',
        bg: '#7F1D1D',
        text: '#FCA5A5',
      },
      info: {
        default: '#3B82F6',
        hover: '#2563EB',
        bg: '#1E3A8A',
        text: '#93C5FD',
      },
    },
    // Accent colors
    accent: {
      primary: '#4C8BF5',       // Primary brand color
      primaryHover: '#6BA3FF',
      secondary: '#8B5CF6',
      secondaryHover: '#A78BFA',
    },
    // Task status colors
    status: {
      backlog: '#6B7280',
      todo: '#3B82F6',
      inProgress: '#8B5CF6',
      codeReview: '#F59E0B',
      testing: '#10B981',
      blocked: '#EF4444',
      done: '#6B7280',
    },
    // Priority colors
    priority: {
      low: '#6B7280',
      medium: '#3B82F6',
      high: '#F59E0B',
      critical: '#EF4444',
    },
  },

  // Light Mode Colors (Secondary)
  light: {
    bg: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      elevated: '#FFFFFF',
      hover: '#F3F4F6',
    },
    surface: {
      base: '#FFFFFF',
      elevated: '#FFFFFF',
      overlay: '#F9FAFB',
    },
    border: {
      subtle: '#F3F4F6',
      default: '#E5E7EB',
      strong: '#D1D5DB',
      focus: '#3B82F6',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
      link: '#3B82F6',
    },
    semantic: {
      success: {
        default: '#10B981',
        hover: '#059669',
        bg: '#D1FAE5',
        text: '#065F46',
      },
      warning: {
        default: '#F59E0B',
        hover: '#D97706',
        bg: '#FEF3C7',
        text: '#92400E',
      },
      error: {
        default: '#EF4444',
        hover: '#DC2626',
        bg: '#FEE2E2',
        text: '#991B1B',
      },
      info: {
        default: '#3B82F6',
        hover: '#2563EB',
        bg: '#DBEAFE',
        text: '#1E40AF',
      },
    },
    accent: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      secondary: '#8B5CF6',
      secondaryHover: '#7C3AED',
    },
    status: {
      backlog: '#6B7280',
      todo: '#3B82F6',
      inProgress: '#8B5CF6',
      codeReview: '#F59E0B',
      testing: '#10B981',
      blocked: '#EF4444',
      done: '#10B981',
    },
    priority: {
      low: '#6B7280',
      medium: '#3B82F6',
      high: '#F59E0B',
      critical: '#EF4444',
    },
  },
};

// Typography Scale
export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Roboto Mono", Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing System
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Z-index layers
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Transition durations
export const transitions = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
};

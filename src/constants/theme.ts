import { COLORS, DARK_COLORS } from "./colors";

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
    "4xl": 40,
    "5xl": 56,
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
} as const;

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Light Theme
export const LIGHT_THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  isDark: false,
} as const;

// Dark Theme
export const DARK_THEME = {
  colors: DARK_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: {
    ...SHADOWS,
    sm: {
      ...SHADOWS.sm,
      shadowColor: COLORS.neutral.bastille,
      shadowOpacity: 0.3,
    },
    md: {
      ...SHADOWS.md,
      shadowColor: COLORS.neutral.bastille,
      shadowOpacity: 0.4,
    },
    lg: {
      ...SHADOWS.lg,
      shadowColor: COLORS.neutral.bastille,
      shadowOpacity: 0.5,
    },
    xl: {
      ...SHADOWS.xl,
      shadowColor: COLORS.neutral.bastille,
      shadowOpacity: 0.6,
    },
  },
  isDark: true,
} as const;

// Component Styles
export const COMPONENT_STYLES = {
  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 56,
    },
    padding: {
      sm: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
      md: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
      lg: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
      xl: { paddingHorizontal: SPACING["2xl"], paddingVertical: SPACING.lg },
    },
  },

  input: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    padding: {
      sm: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
      md: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
      lg: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
    },
  },

  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.white,
  },

  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background.white,
  },
} as const;

// Export theme type
export type Theme = typeof LIGHT_THEME;
export type ThemeColors = typeof COLORS;

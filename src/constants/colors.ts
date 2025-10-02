// Color Palette - Based on Design System
export const COLORS = {
  // Primary Color - Picton Blue
  primary: {
    50: "#EBF8FF",
    100: "#BEE3F8",
    200: "#90CDF4",
    300: "#63B3ED",
    400: "#4299E1",
    500: "#3182CE", // Main Picton Blue
    600: "#2B77CB",
    700: "#2C5AA0",
    800: "#2A4365",
    900: "#1A365D",
  },

  // Accent Colors
  accent: {
    orange: "#FF7D56", // Orange
    navyBlue: "#1A73E8", // Navy Blue
  },

  // Action/Semantic Colors
  action: {
    lima: "#84CC16", // Lima (Success/Income)
    webOrange: "#FF9500", // Web Orange (Warning)
    azureRadiance: "#007AFF", // Azure Radiance (Info)
    coralRed: "#FF3B30", // Coral Red (Error/Expense)
    iron: "#8E8E93", // Iron (Disabled)
  },

  // Neutral/Text Colors
  neutral: {
    bastille: "#0F1419", // Bastille (Primary Text)
    shipGray: "#3C3C43", // Ship Gray (Secondary Text)
    mortar: "#545458", // Mortar (Tertiary Text)
    mountainMist: "#98989D", // Mountain Mist (Placeholder)
    spunPearl: "#AEAEB2", // Spun Pearl (Border)
  },

  // Divider Colors
  divider: {
    silverSand: "#C7C7CC", // Silver Sand
    platinum: "#E5E5EA", // Platinum
  },

  // Background Colors
  background: {
    flashWhite: "#F2F2F7", // Flash White
    alabaster: "#F9F9F9", // Alabaster
    white: "#FFFFFF", // White
  },

  // Gradient
  gradient: {
    primary: ["#72C6EF", "#004E89"], // Gradient colors
  },

  // Semantic Colors (mapped to action colors)
  success: "#84CC16", // Lima
  warning: "#FF9500", // Web Orange
  error: "#FF3B30", // Coral Red
  info: "#007AFF", // Azure Radiance

  // Text Colors (mapped to neutral colors)
  text: {
    primary: "#0F1419", // Bastille
    secondary: "#3C3C43", // Ship Gray
    tertiary: "#545458", // Mortar
    placeholder: "#98989D", // Mountain Mist
    inverse: "#FFFFFF",
  },

  // Border Colors
  border: {
    light: "#E5E5EA", // Platinum
    medium: "#C7C7CC", // Silver Sand
    dark: "#AEAEB2", // Spun Pearl
  },

  // Special Colors
  white: "#FFFFFF",
  black: "#0F1419",
  transparent: "transparent",

  // Chart Colors
  chart: {
    income: "#84CC16", // Lima
    expense: "#FF3B30", // Coral Red
    transfer: "#007AFF", // Azure Radiance
    budget: "#FF9500", // Web Orange
    savings: "#3182CE", // Primary Blue
  },
} as const;

// Dark Theme Colors
export const DARK_COLORS = {
  ...COLORS,

  // Background Colors (Dark)
  background: {
    primary: "#0F1419", // Bastille
    secondary: "#1C1C1E", // Dark secondary
    tertiary: "#2C2C2E", // Dark tertiary
  },

  // Text Colors (Dark)
  text: {
    primary: "#FFFFFF", // White
    secondary: "#AEAEB2", // Spun Pearl
    tertiary: "#8E8E93", // Iron
    placeholder: "#545458", // Mortar
    inverse: "#0F1419", // Bastille
  },

  // Border Colors (Dark)
  border: {
    light: "#3C3C43", // Ship Gray
    medium: "#545458", // Mortar
    dark: "#8E8E93", // Iron
  },

  // Neutral colors adjusted for dark theme
  neutral: {
    bastille: "#FFFFFF", // Inverted for dark theme
    shipGray: "#AEAEB2",
    mortar: "#8E8E93",
    mountainMist: "#545458",
    spunPearl: "#3C3C43",
  },
} as const;

// Color Utilities
export const getColorByType = (type: "income" | "expense" | "transfer") => {
  switch (type) {
    case "income":
      return COLORS.action.lima; // Lima green for income
    case "expense":
      return COLORS.action.coralRed; // Coral red for expense
    case "transfer":
      return COLORS.action.azureRadiance; // Azure radiance for transfer
    default:
      return COLORS.neutral.mountainMist;
  }
};

export const getCategoryColor = (categoryId: string) => {
  const colors = [
    COLORS.primary[500],
    COLORS.action.lima,
    COLORS.action.coralRed,
    COLORS.action.webOrange,
    COLORS.action.azureRadiance,
    COLORS.accent.orange,
    COLORS.accent.navyBlue,
    COLORS.primary[600],
    COLORS.primary[700],
  ];

  const index = categoryId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

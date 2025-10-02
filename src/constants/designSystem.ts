// Design System Colors - Exact mapping from your design
export const DESIGN_SYSTEM_COLORS = {
  // Primary
  pictonBlue: '#72C6EF',
  
  // Accent (Secondary)
  orange: '#FF7D56',
  navyBlue: '#1A73E8',
  
  // Action (Semantic)
  lima: '#84CC16',        // Success/Income
  webOrange: '#FF9500',   // Warning
  azureRadiance: '#007AFF', // Info
  coralRed: '#FF3B30',    // Error/Expense
  iron: '#8E8E93',        // Disabled
  
  // Neutral (Text)
  bastille: '#0F1419',    // Primary text
  shipGray: '#3C3C43',    // Secondary text
  mortar: '#545458',      // Tertiary text
  mountainMist: '#98989D', // Placeholder
  spunPearl: '#AEAEB2',   // Border
  
  // Divider
  silverSand: '#C7C7CC',
  platinum: '#E5E5EA',
  
  // Background
  flashWhite: '#F2F2F7',
  alabaster: '#F9F9F9',
  white: '#FFFFFF',
  
  // Gradient
  gradientStart: '#72C6EF',
  gradientEnd: '#004E89',
} as const;

// Semantic color mapping for easy usage
export const SEMANTIC_COLORS = {
  primary: DESIGN_SYSTEM_COLORS.pictonBlue,
  success: DESIGN_SYSTEM_COLORS.lima,
  warning: DESIGN_SYSTEM_COLORS.webOrange,
  error: DESIGN_SYSTEM_COLORS.coralRed,
  info: DESIGN_SYSTEM_COLORS.azureRadiance,
  disabled: DESIGN_SYSTEM_COLORS.iron,
  
  // Text colors
  textPrimary: DESIGN_SYSTEM_COLORS.bastille,
  textSecondary: DESIGN_SYSTEM_COLORS.shipGray,
  textTertiary: DESIGN_SYSTEM_COLORS.mortar,
  textPlaceholder: DESIGN_SYSTEM_COLORS.mountainMist,
  
  // Background colors
  backgroundPrimary: DESIGN_SYSTEM_COLORS.white,
  backgroundSecondary: DESIGN_SYSTEM_COLORS.alabaster,
  backgroundTertiary: DESIGN_SYSTEM_COLORS.flashWhite,
  
  // Border colors
  borderLight: DESIGN_SYSTEM_COLORS.platinum,
  borderMedium: DESIGN_SYSTEM_COLORS.silverSand,
  borderDark: DESIGN_SYSTEM_COLORS.spunPearl,
} as const;

// Transaction type colors
export const TRANSACTION_COLORS = {
  income: DESIGN_SYSTEM_COLORS.lima,
  expense: DESIGN_SYSTEM_COLORS.coralRed,
  transfer: DESIGN_SYSTEM_COLORS.azureRadiance,
} as const;

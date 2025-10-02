// Design System
export * from "./designSystem";

// App Constants
export const APP_NAME = "MoneyCare";
export const APP_VERSION = "1.0.0";

// API Constants
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://api.moneycare.com";

export const API_TIMEOUT = 10000;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME_PREFERENCE: "theme_preference",
  LANGUAGE_PREFERENCE: "language_preference",
  BIOMETRIC_ENABLED: "biometric_enabled",
  ONBOARDING_COMPLETED: "onboarding_completed",
  HAS_SEEN_ONBOARDING: "has_seen_onboarding",
} as const;

// Screen Names
export const SCREEN_NAMES = {
  // Auth Screens
  LOGIN: "Login",
  REGISTER: "Register",
  FORGOT_PASSWORD: "ForgotPassword",
  RESET_PASSWORD: "ResetPassword",

  // Main Screens
  HOME: "Home",
  TRANSACTIONS: "Transactions",
  BUDGETS: "Budgets",
  ANALYTICS: "Analytics",
  PROFILE: "Profile",

  // Transaction Screens
  ADD_TRANSACTION: "AddTransaction",
  EDIT_TRANSACTION: "EditTransaction",
  TRANSACTION_DETAIL: "TransactionDetail",

  // Budget Screens
  ADD_BUDGET: "AddBudget",
  EDIT_BUDGET: "EditBudget",
  BUDGET_DETAIL: "BudgetDetail",

  // Settings Screens
  SETTINGS: "Settings",
  ACCOUNT_SETTINGS: "AccountSettings",
  SECURITY_SETTINGS: "SecuritySettings",
  NOTIFICATION_SETTINGS: "NotificationSettings",
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
} as const;

// Transaction Categories
export const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Dining", icon: "restaurant" },
  { id: "transport", name: "Transportation", icon: "directions-car" },
  { id: "shopping", name: "Shopping", icon: "shopping-cart" },
  { id: "entertainment", name: "Entertainment", icon: "movie" },
  { id: "bills", name: "Bills & Utilities", icon: "receipt" },
  { id: "healthcare", name: "Healthcare", icon: "local-hospital" },
  { id: "education", name: "Education", icon: "school" },
  { id: "travel", name: "Travel", icon: "flight" },
  { id: "other", name: "Other", icon: "more-horiz" },
] as const;

export const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary", icon: "work" },
  { id: "freelance", name: "Freelance", icon: "laptop" },
  { id: "investment", name: "Investment", icon: "trending-up" },
  { id: "business", name: "Business", icon: "business" },
  { id: "gift", name: "Gift", icon: "card-giftcard" },
  { id: "other", name: "Other", icon: "more-horiz" },
] as const;

// Budget Periods
export const BUDGET_PERIODS = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

// Currency
export const DEFAULT_CURRENCY = "VND";
export const SUPPORTED_CURRENCIES = [
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
] as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DD",
  FULL: "DD/MM/YYYY HH:mm",
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  TRANSACTION_AMOUNT_MAX: 999999999,
  BUDGET_AMOUNT_MAX: 999999999,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

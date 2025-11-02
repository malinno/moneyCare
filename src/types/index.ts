import type { NavigatorScreenParams } from "@react-navigation/native";

// User Types
export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  description?: string;
  date: string;
  accountId?: string;
  accountName?: string;
  tags?: string[];
  location?: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  isDefault: boolean;
  userId?: string;
}

export interface CreateTransactionData {
  type: "income" | "expense" | "transfer";
  amount: number;
  categoryId: string;
  description?: string;
  date: string;
  accountId?: string;
  tags?: string[];
  location?: string;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  spent: number;
  currency: string;
  period: "weekly" | "monthly" | "yearly";
  categoryIds: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetData {
  name: string;
  amount: number;
  period: "weekly" | "monthly" | "yearly";
  categoryIds: string[];
  startDate: string;
}

// Account Types
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "checking" | "savings" | "credit" | "cash" | "investment";
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsData {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  budgetUtilization: number;
  topCategories: CategoryAnalytics[];
  monthlyTrend: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  netIncome: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  color: string;
}

// Navigation Types
export type RootStackParamList = {
  Intro: undefined;
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Welcome: undefined;
  IntroJars: undefined;
  SelectFund: undefined;
  Income: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type HomeStackParamList = {
  Home: { showAddModal?: boolean };
  CreateCategory: undefined;
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  Transactions: undefined;
  AddTransaction: undefined;
  EditTransaction: { transaction: Transaction };
  Statistics: undefined;
  Profile: undefined;
};

export type TransactionStackParamList = {
  TransactionList: undefined;
  AddTransaction: { type?: "income" | "expense" };
  EditTransaction: { transactionId: string };
  TransactionDetail: { transactionId: string };
};

export type BudgetStackParamList = {
  BudgetList: undefined;
  AddBudget: undefined;
  EditBudget: { budgetId: string };
  BudgetDetail: { budgetId: string };
};

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "date"
    | "textarea";
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: { label: string; value: string }[];
}

// Theme Types
export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  colors: any;
}

// Settings Types
export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  currency: string;
  notifications: {
    budgetAlerts: boolean;
    transactionReminders: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };
  security: {
    biometricEnabled: boolean;
    autoLockEnabled: boolean;
    autoLockDuration: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
  }[];
}

export interface PieChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}
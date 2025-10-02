import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '@types/index';

const initialState: AppSettings = {
  theme: 'system',
  language: 'vi',
  currency: 'VND',
  notifications: {
    budgetAlerts: true,
    transactionReminders: true,
    weeklyReports: true,
    monthlyReports: true,
  },
  security: {
    biometricEnabled: false,
    autoLockEnabled: true,
    autoLockDuration: 300, // 5 minutes
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<AppSettings['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateSecuritySettings: (state, action: PayloadAction<Partial<AppSettings['security']>>) => {
      state.security = { ...state.security, ...action.payload };
    },
    resetSettings: () => initialState,
  },
});

export const {
  updateTheme,
  updateLanguage,
  updateCurrency,
  updateNotificationSettings,
  updateSecuritySettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { updateTheme } from '@store/slices/settingsSlice';
import { LIGHT_THEME, DARK_THEME, Theme } from '@constants/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const themePreference = useSelector((state: RootState) => state.settings.theme);
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(LIGHT_THEME);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    updateCurrentTheme();
  }, [themePreference, systemColorScheme]);

  const updateCurrentTheme = () => {
    let shouldUseDark = false;

    switch (themePreference) {
      case 'dark':
        shouldUseDark = true;
        break;
      case 'light':
        shouldUseDark = false;
        break;
      case 'system':
      default:
        shouldUseDark = systemColorScheme === 'dark';
        break;
    }

    setIsDark(shouldUseDark);
    setCurrentTheme(shouldUseDark ? DARK_THEME : LIGHT_THEME);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    dispatch(updateTheme(newTheme));
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch(updateTheme(theme));
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

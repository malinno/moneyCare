import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@store/index";
import { getCurrentUser, clearAuth } from "@store/slices/authSlice";
import { fakeAuthService } from "@services/auth/fakeAuthService";
import { User } from "@types/index";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await fakeAuthService.isAuthenticated();
      if (isAuth) {
        dispatch(getCurrentUser());
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch(clearAuth());
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await fakeAuthService.login({ email: username, password });
      dispatch(getCurrentUser());
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (userData: any) => {
    try {
      await fakeAuthService.register(userData);
      dispatch(getCurrentUser());
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await fakeAuthService.getStoredUser();
      if (refreshToken) {
        await fakeAuthService.logout(refreshToken as any);
      }
      dispatch(clearAuth());
    } catch (error: any) {
      console.error("Logout error:", error);
      dispatch(clearAuth());
    }
  };

  const refreshUser = async () => {
    try {
      dispatch(getCurrentUser());
    } catch (error: any) {
      console.error("Refresh user error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

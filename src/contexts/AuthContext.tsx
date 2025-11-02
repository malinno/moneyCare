import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@store/index";
import { getCurrentUser, clearAuth, loginUser, registerUser } from "@store/slices/authSlice";
import { authService } from "@services/auth/authService";
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
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        // Gọi API để lấy thông tin user hiện tại
        dispatch(getCurrentUser());
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch(clearAuth());
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(result)) {
        // Không gọi getCurrentUser vì API không có endpoint /auth/me
        // User data sẽ được lưu từ login response
      } else {
        throw new Error(result.payload as string || "Login failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (userData: any) => {
    try {
      const result = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(result)) {
        // Không gọi getCurrentUser vì API không có endpoint /auth/me
        // User data sẽ được lưu từ register response
      } else {
        throw new Error(result.payload as string || "Registration failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await authService.getStoredUser();
      if (refreshToken) {
        await authService.logout(refreshToken as any);
      }
      dispatch(clearAuth());
    } catch (error: any) {
      console.error("Logout error:", error);
      dispatch(clearAuth());
    }
  };

  const refreshUser = async () => {
    try {
      // Gọi API để lấy thông tin user mới nhất
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

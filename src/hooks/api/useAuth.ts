import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@services/auth/authService";
import { queryKeys, invalidateQueries } from "@config/queryClient";
import { User, LoginCredentials, RegisterData } from "@types/index";

// Get current user
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authService.getStoredUser, // Sử dụng stored user thay vì API call
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on auth errors
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      // Invalidate all queries to refresh data
      invalidateQueries.all();
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      // Invalidate all queries to refresh data
      invalidateQueries.all();
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await authService.getStoredUser();
      if (refreshToken) {
        await authService.logout(refreshToken as any);
      }
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Clear cache anyway
      queryClient.clear();
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) =>
      authService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      // Update user in cache
      queryClient.setQueryData(queryKeys.auth.user, updatedUser);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword),
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
    onError: (error) => {
      console.error("Reset password failed:", error);
    },
  });
};

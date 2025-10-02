import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@config/api';
import { STORAGE_KEYS } from '@constants/index';
import { User, LoginCredentials, RegisterData } from '@types/index';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.success) {
      const { user, accessToken, refreshToken } = response.data.data;
      
      // Store tokens and user data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      ]);
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  // Register
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    if (response.data.success) {
      const { user, accessToken, refreshToken } = response.data.data;
      
      // Store tokens and user data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      ]);
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Registration failed');
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    if (response.data.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      // Update stored tokens
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
      ]);
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Token refresh failed');
  },

  // Logout
  async logout(refreshToken: string): Promise<void> {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear stored data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    
    if (response.data.success) {
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get current user');
  },

  // Update profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/auth/profile', userData);
    
    if (response.data.success) {
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Profile update failed');
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Password change failed');
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    const response = await api.post('/auth/forgot-password', { email });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send reset email');
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Password reset failed');
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    const response = await api.post('/auth/verify-email', { token });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Email verification failed');
    }
  },

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    const response = await api.post('/auth/resend-verification');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to resend verification email');
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@constants/index';
import { STORAGE_KEYS } from '@constants/index';
import { User, LoginCredentials, RegisterData } from '../../types/index';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User; // Thêm user data nếu API trả về
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        timeout: 30000, // Tăng timeout cho login
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const { accessToken, refreshToken, user } = response.data;
      
      // Store tokens
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
      
      // Store user data nếu có
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
      
      return response.data;
    } catch (error: any) {
      
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và đảm bảo backend server đang chạy.');
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('Kết nối quá chậm. Vui lòng kiểm tra kết nối mạng và thử lại.');
      } else if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || 'Lỗi từ server';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error(error.message || 'Có lỗi xảy ra khi đăng nhập');
      }
    }
  },

  // Register
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
        timeout: 30000, // Tăng timeout cho register
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const { id, username, accessToken, refreshToken } = response.data;
      
      // Create user object from response
      const user: User = {
        id,
        username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store tokens and user data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      ]);
      
      return response.data;
    } catch (error: any) {
      console.error('Register API Error:', error);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và đảm bảo backend server đang chạy.');
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('Kết nối quá chậm. Vui lòng kiểm tra kết nối mạng và thử lại.');
      } else if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || error.response.data?.error || 'Lỗi từ server';
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw new Error(error.message || 'Có lỗi xảy ra khi đăng ký');
      }
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Update stored tokens
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
      ]);
      
      return response.data;
    } catch (error: any) {
      console.error('Refresh Token Error:', error);
      throw new Error('Token refresh failed');
    }
  },

  // Logout
  async logout(refreshToken: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, { refreshToken });
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
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      console.error('Get Current User Error:', error);
      throw new Error('Failed to get current user');
    }
  },

  // Update profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/auth/profile`, userData);
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      throw new Error('Profile update failed');
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.patch(`${API_BASE_URL}/auth/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      console.error('Change Password Error:', error);
      throw new Error('Password change failed');
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      throw new Error('Failed to send reset email');
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      throw new Error('Password reset failed');
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-email`, { token });
    } catch (error: any) {
      console.error('Verify Email Error:', error);
      throw new Error('Email verification failed');
    }
  },

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/resend-verification`);
    } catch (error: any) {
      console.error('Resend Verification Error:', error);
      throw new Error('Failed to resend verification email');
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
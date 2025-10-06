import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@constants/index";
import { User, LoginCredentials, RegisterData } from "@/types/index";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Fake users database
const fakeUsers: User[] = [
  {
    id: "1",
    email: "admin@moneycare.com",
    firstName: "Admin",
    lastName: "User",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "+84123456789",
    dateOfBirth: "1990-01-01",
    currency: "VND",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "demo@moneycare.com",
    firstName: "Demo",
    lastName: "User",
    avatar: "https://via.placeholder.com/150",
    phoneNumber: "+84987654321",
    dateOfBirth: "1995-05-15",
    currency: "VND",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fakeAuthService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay

    // Find user by email/username (for existing test accounts)
    const user = fakeUsers.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("Tên đăng nhập không tồn tại");
    }

    // Simple password check (in real app, this would be hashed)
    if (credentials.password !== "123456") {
      throw new Error("Mật khẩu không đúng");
    }

    const accessToken = `fake_access_token_${user.id}_${Date.now()}`;
    const refreshToken = `fake_refresh_token_${user.id}_${Date.now()}`;

    // Store tokens and user data
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
    ]);

    return { user, accessToken, refreshToken };
  },

  // Register
  async register(userData: RegisterData): Promise<AuthResponse> {
    await delay(1500); // Simulate network delay

    // Check if username already exists
    const existingUser = fakeUsers.find((u) => u.email === userData.username);
    if (existingUser) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.username,
      firstName: userData.username,
      lastName: "User",
      avatar: "https://via.placeholder.com/150",
      phoneNumber: undefined,
      dateOfBirth: undefined,
      currency: "VND",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to fake database
    fakeUsers.push(newUser);

    const accessToken = `fake_access_token_${newUser.id}_${Date.now()}`;
    const refreshToken = `fake_refresh_token_${newUser.id}_${Date.now()}`;

    // Store tokens and user data
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [STORAGE_KEYS.USER_DATA, JSON.stringify(newUser)],
    ]);

    return { user: newUser, accessToken, refreshToken };
  },

  // Refresh token
  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await delay(500);

    const newAccessToken = `fake_access_token_${Date.now()}`;
    const newRefreshToken = `fake_refresh_token_${Date.now()}`;

    // Update stored tokens
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, newAccessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  // Logout
  async logout(refreshToken: string): Promise<void> {
    await delay(500);

    // Clear stored data
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    await delay(800);

    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) {
      throw new Error("User not found");
    }

    return JSON.parse(userData);
  },

  // Update profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    await delay(1000);

    const currentUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!currentUserData) {
      throw new Error("User not found");
    }

    const currentUser = JSON.parse(currentUserData);
    const updatedUser = {
      ...currentUser,
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    // Update in fake database
    const userIndex = fakeUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      fakeUsers[userIndex] = updatedUser;
    }

    // Update stored user data
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(updatedUser)
    );

    return updatedUser;
  },

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await delay(1000);

    if (currentPassword !== "123456") {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    // In a real app, you would hash the new password
    console.log("Password changed to:", newPassword);
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await delay(1000);

    const user = fakeUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    console.log("Password reset email sent to:", email);
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await delay(1000);

    if (!token || token !== "valid_reset_token") {
      throw new Error("Token không hợp lệ");
    }

    console.log("Password reset to:", newPassword);
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await delay(1000);

    if (!token || token !== "valid_verification_token") {
      throw new Error("Token xác thực không hợp lệ");
    }

    console.log("Email verified successfully");
  },

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    await delay(1000);

    console.log("Verification email resent");
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

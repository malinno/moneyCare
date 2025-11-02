import { apiClient } from '@config/api';

export interface User {
  id: string;
  username: string;
}

export interface UserResponse {
  id: string;
  username: string;
}

export const userService = {
  /**
   * Get current user information
   * @returns Promise<UserResponse>
   */
  getMe: async (): Promise<UserResponse> => {
    try {
      console.log('Fetching user info from /users/me...');
      // Use apiClient directly since /users/me returns direct object, not wrapped in ApiResponse
      const response = await apiClient.get<UserResponse>('/users/me');
      console.log('User info response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },
};

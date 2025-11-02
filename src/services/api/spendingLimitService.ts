import { apiClient } from '@config/api';

export interface SpendingLimit {
  _id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  period: string; // 'monthly', 'weekly', 'yearly'
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateSpendingLimitData {
  categoryId: string;
  limit: number;
  period: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSpendingLimitData {
  limit?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const spendingLimitService = {
  /**
   * Get all spending limits
   * @returns Promise<SpendingLimit[]>
   */
  getSpendingLimits: async (): Promise<SpendingLimit[]> => {
    try {
      console.log('spendingLimitService.getSpendingLimits - Fetching spending limits');
      
      const response = await apiClient.get<SpendingLimit[]>('/spending-limits');
      console.log('spendingLimitService.getSpendingLimits - Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('spendingLimitService.getSpendingLimits - Error:', error);
      throw error;
    }
  },

  /**
   * Get spending limit by ID
   * @param id - Spending limit ID
   * @returns Promise<SpendingLimit>
   */
  getSpendingLimitById: async (id: string): Promise<SpendingLimit> => {
    try {
      console.log('spendingLimitService.getSpendingLimitById - Fetching spending limit:', id);
      
      const response = await apiClient.get<SpendingLimit>(`/spending-limits/${id}`);
      console.log('spendingLimitService.getSpendingLimitById - Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('spendingLimitService.getSpendingLimitById - Error:', error);
      throw error;
    }
  },

  /**
   * Create new spending limit
   * @param data - Spending limit data
   * @returns Promise<SpendingLimit>
   */
  createSpendingLimit: async (data: CreateSpendingLimitData): Promise<SpendingLimit> => {
    try {
      console.log('spendingLimitService.createSpendingLimit - Creating spending limit:', data);
      
      const response = await apiClient.post<SpendingLimit>('/spending-limits', data);
      console.log('spendingLimitService.createSpendingLimit - Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('spendingLimitService.createSpendingLimit - Error:', error);
      throw error;
    }
  },

  /**
   * Update spending limit
   * @param id - Spending limit ID
   * @param data - Update data
   * @returns Promise<SpendingLimit>
   */
  updateSpendingLimit: async (id: string, data: UpdateSpendingLimitData): Promise<SpendingLimit> => {
    try {
      console.log('spendingLimitService.updateSpendingLimit - Updating spending limit:', id, data);
      
      const response = await apiClient.put<SpendingLimit>(`/spending-limits/${id}`, data);
      console.log('spendingLimitService.updateSpendingLimit - Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('spendingLimitService.updateSpendingLimit - Error:', error);
      throw error;
    }
  },

  /**
   * Delete spending limit
   * @param id - Spending limit ID
   * @returns Promise<void>
   */
  deleteSpendingLimit: async (id: string): Promise<void> => {
    try {
      console.log('spendingLimitService.deleteSpendingLimit - Deleting spending limit:', id);
      
      await apiClient.delete(`/spending-limits/${id}`);
      console.log('spendingLimitService.deleteSpendingLimit - Success');
    } catch (error) {
      console.error('spendingLimitService.deleteSpendingLimit - Error:', error);
      throw error;
    }
  },
};




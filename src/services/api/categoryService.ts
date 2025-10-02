import { api } from '@config/api';
import { TransactionCategory } from '@types/index';

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<TransactionCategory[]> {
    const response = await api.get<TransactionCategory[]>('/categories');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch categories');
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<TransactionCategory> {
    const response = await api.get<TransactionCategory>(`/categories/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch category');
  },

  // Create category
  async createCategory(data: Omit<TransactionCategory, 'id' | 'isDefault'>): Promise<TransactionCategory> {
    const response = await api.post<TransactionCategory>('/categories', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to create category');
  },

  // Update category
  async updateCategory(id: string, data: Partial<TransactionCategory>): Promise<TransactionCategory> {
    const response = await api.patch<TransactionCategory>(`/categories/${id}`, data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to update category');
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    const response = await api.delete(`/categories/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete category');
    }
  },

  // Get categories by type
  async getCategoriesByType(type: 'income' | 'expense'): Promise<TransactionCategory[]> {
    const response = await api.get<TransactionCategory[]>(`/categories/type/${type}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch categories by type');
  },

  // Get category statistics
  async getCategoryStats(params: {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
  }): Promise<Array<{
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
    averageAmount: number;
  }>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await api.get(`/categories/stats?${queryParams.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch category statistics');
  },

  // Get default categories
  async getDefaultCategories(): Promise<TransactionCategory[]> {
    const response = await api.get<TransactionCategory[]>('/categories/defaults');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch default categories');
  },

  // Reset to default categories
  async resetToDefaultCategories(): Promise<TransactionCategory[]> {
    const response = await api.post<TransactionCategory[]>('/categories/reset-defaults');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to reset to default categories');
  },
};

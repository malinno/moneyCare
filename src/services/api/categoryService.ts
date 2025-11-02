import { apiClient } from '@config/api';

export interface Category {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  budgetLimit: number;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCategoryData {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  budgetLimit: number;
  percentage: number;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
  type?: 'income' | 'expense';
  budgetLimit?: number;
}

export const categoryService = {
  /**
   * Get all categories for the current user
   * @returns Promise<Category[]>
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      console.log('Fetching categories from /categories...');
      const response = await apiClient.get<Category[]>('/categories');
      console.log('Categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a specific category by ID
   * @param categoryId - The category ID
   * @returns Promise<Category>
   */
  getCategoryById: async (categoryId: string): Promise<Category> => {
    try {
      const response = await apiClient.get<Category>(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param categoryData - The category data
   * @returns Promise<Category>
   */
  createCategory: async (categoryData: CreateCategoryData): Promise<Category> => {
    try {
      const response = await apiClient.post<Category>('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update a category
   * @param categoryId - The category ID
   * @param categoryData - The updated category data
   * @returns Promise<Category>
   */
  updateCategory: async (categoryId: string, categoryData: UpdateCategoryData): Promise<Category> => {
    try {
      const response = await apiClient.put<Category>(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param categoryId - The category ID
   * @returns Promise<void>
   */
  deleteCategory: async (categoryId: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
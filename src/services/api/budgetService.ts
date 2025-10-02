import { api } from '@config/api';
import { Budget, CreateBudgetData } from '@types/index';

export const budgetService = {
  // Get all budgets
  async getBudgets(): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch budgets');
  },

  // Get budget by ID
  async getBudgetById(id: string): Promise<Budget> {
    const response = await api.get<Budget>(`/budgets/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch budget');
  },

  // Create budget
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    const response = await api.post<Budget>('/budgets', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to create budget');
  },

  // Update budget
  async updateBudget(id: string, data: Partial<CreateBudgetData>): Promise<Budget> {
    const response = await api.patch<Budget>(`/budgets/${id}`, data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to update budget');
  },

  // Delete budget
  async deleteBudget(id: string): Promise<void> {
    const response = await api.delete(`/budgets/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete budget');
    }
  },

  // Get budget progress
  async getBudgetProgress(id: string): Promise<{
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
    isOverBudget: boolean;
    transactions: Array<{
      id: string;
      amount: number;
      description: string;
      date: string;
      categoryName: string;
    }>;
  }> {
    const response = await api.get(`/budgets/${id}/progress`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch budget progress');
  },

  // Get active budgets
  async getActiveBudgets(): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets/active');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch active budgets');
  },

  // Get budget alerts
  async getBudgetAlerts(): Promise<Array<{
    budgetId: string;
    budgetName: string;
    percentage: number;
    amount: number;
    limit: number;
    type: 'warning' | 'danger';
  }>> {
    const response = await api.get('/budgets/alerts');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch budget alerts');
  },

  // Get budget statistics
  async getBudgetStats(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalBudgets: number;
    activeBudgets: number;
    totalBudgetAmount: number;
    totalSpent: number;
    averageUtilization: number;
    overBudgetCount: number;
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await api.get(`/budgets/stats?${queryParams.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch budget statistics');
  },
};

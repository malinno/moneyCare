import axios from 'axios';
import { API_BASE_URL } from '@constants/index';
import { Budget, CreateBudgetData } from '@/types/index';

export const budgetService = {
  // Get all budgets
  async getBudgets(): Promise<Budget[]> {
    const response = await axios.get(`${API_BASE_URL}/budgets`);
    return response.data;
  },

  // Get budget by ID
  async getBudgetById(id: string): Promise<Budget> {
    const response = await axios.get(`${API_BASE_URL}/budgets/${id}`);
    return response.data;
  },

  // Create budget
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    const response = await axios.post(`${API_BASE_URL}/budgets`, data);
    return response.data;
  },

  // Update budget
  async updateBudget(id: string, data: Partial<CreateBudgetData>): Promise<Budget> {
    const response = await axios.patch(`${API_BASE_URL}/budgets/${id}`, data);
    return response.data;
  },

  // Delete budget
  async deleteBudget(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/budgets/${id}`);
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
    const response = await axios.get(`${API_BASE_URL}/budgets/${id}/progress`);
    return response.data;
  },

  // Get active budgets
  async getActiveBudgets(): Promise<Budget[]> {
    const response = await axios.get(`${API_BASE_URL}/budgets/active`);
    return response.data;
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
    const response = await axios.get(`${API_BASE_URL}/budgets/alerts`);
    return response.data;
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
    
    const response = await axios.get(`${API_BASE_URL}/budgets/stats?${queryParams.toString()}`);
    return response.data;
  },
};

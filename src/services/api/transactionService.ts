import { api } from '@config/api';
import { Transaction, CreateTransactionData, PaginatedResponse } from '@types/index';

export const transactionService = {
  // Get transactions with pagination and filters
  async getTransactions(params: {
    page?: number;
    limit?: number;
    filters?: {
      type?: 'income' | 'expense' | 'transfer';
      categoryId?: string;
      accountId?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    };
  }): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const response = await api.get<PaginatedResponse<Transaction>>(`/transactions?${queryParams.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch transactions');
  },

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch transaction');
  },

  // Create transaction
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to create transaction');
  },

  // Update transaction
  async updateTransaction(id: string, data: Partial<CreateTransactionData>): Promise<Transaction> {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to update transaction');
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    const response = await api.delete(`/transactions/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete transaction');
    }
  },

  // Get transaction statistics
  async getTransactionStats(params: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Promise<{
    totalIncome: number;
    totalExpense: number;
    netIncome: number;
    transactionCount: number;
    categoryBreakdown: Array<{
      categoryId: string;
      categoryName: string;
      amount: number;
      count: number;
    }>;
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await api.get(`/transactions/stats?${queryParams.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch transaction statistics');
  },

  // Get recent transactions
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(`/transactions/recent?limit=${limit}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch recent transactions');
  },

  // Search transactions
  async searchTransactions(query: string, limit: number = 20): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(`/transactions/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to search transactions');
  },

  // Bulk delete transactions
  async bulkDeleteTransactions(ids: string[]): Promise<void> {
    const response = await api.delete('/transactions/bulk', {
      data: { ids },
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete transactions');
    }
  },

  // Export transactions
  async exportTransactions(params: {
    format: 'csv' | 'xlsx' | 'pdf';
    startDate?: string;
    endDate?: string;
    categoryIds?: string[];
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    
    const response = await api.get(`/transactions/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });
    
    return response.data;
  },
};

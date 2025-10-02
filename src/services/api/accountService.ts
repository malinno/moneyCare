import { api } from '@config/api';
import { Account } from '@types/index';

export const accountService = {
  // Get all accounts
  async getAccounts(): Promise<Account[]> {
    const response = await api.get<Account[]>('/accounts');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch accounts');
  },

  // Get account by ID
  async getAccountById(id: string): Promise<Account> {
    const response = await api.get<Account>(`/accounts/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch account');
  },

  // Create account
  async createAccount(data: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const response = await api.post<Account>('/accounts', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to create account');
  },

  // Update account
  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    const response = await api.patch<Account>(`/accounts/${id}`, data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to update account');
  },

  // Delete account
  async deleteAccount(id: string): Promise<void> {
    const response = await api.delete(`/accounts/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete account');
    }
  },

  // Get account balance history
  async getAccountBalanceHistory(id: string, params: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }): Promise<Array<{
    date: string;
    balance: number;
    change: number;
  }>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await api.get(`/accounts/${id}/balance-history?${queryParams.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch account balance history');
  },

  // Get account transactions
  async getAccountTransactions(id: string, params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    transactions: Array<{
      id: string;
      type: 'income' | 'expense' | 'transfer';
      amount: number;
      description: string;
      date: string;
      categoryName: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    const response = await api.get(`/accounts/${id}/transactions?${queryParams.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch account transactions');
  },

  // Transfer between accounts
  async transferBetweenAccounts(data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
  }): Promise<{
    fromTransaction: any;
    toTransaction: any;
  }> {
    const response = await api.post('/accounts/transfer', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to transfer between accounts');
  },

  // Get account summary
  async getAccountSummary(): Promise<{
    totalBalance: number;
    totalAccounts: number;
    accountsByType: Record<string, {
      count: number;
      totalBalance: number;
    }>;
    recentTransactions: Array<{
      id: string;
      accountName: string;
      type: 'income' | 'expense' | 'transfer';
      amount: number;
      date: string;
    }>;
  }> {
    const response = await api.get('/accounts/summary');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch account summary');
  },
};

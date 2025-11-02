import axios from 'axios';
import { API_BASE_URL } from '@constants/index';
import { Account } from '@/types/index';

export const accountService = {
  // Get all accounts
  async getAccounts(): Promise<Account[]> {
    const response = await axios.get(`${API_BASE_URL}/accounts`);
    return response.data;
  },

  // Get account by ID
  async getAccountById(id: string): Promise<Account> {
    const response = await axios.get(`${API_BASE_URL}/accounts/${id}`);
    return response.data;
  },

  // Create account
  async createAccount(data: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const response = await axios.post(`${API_BASE_URL}/accounts`, data);
    return response.data;
  },

  // Update account
  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    const response = await axios.patch(`${API_BASE_URL}/accounts/${id}`, data);
    return response.data;
  },

  // Delete account
  async deleteAccount(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/accounts/${id}`);
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
    
    const response = await axios.get(`${API_BASE_URL}/accounts/${id}/balance-history?${queryParams.toString()}`);
    return response.data;
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
    
    const response = await axios.get(`${API_BASE_URL}/accounts/${id}/transactions?${queryParams.toString()}`);
    return response.data;
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
    const response = await axios.post(`${API_BASE_URL}/accounts/transfer`, data);
    return response.data;
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
    const response = await axios.get(`${API_BASE_URL}/accounts/summary`);
    return response.data;
  },
};

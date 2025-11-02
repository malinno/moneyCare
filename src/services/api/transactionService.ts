import { apiClient } from '@config/api';

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  notes: string;
  date: string;
  image?: string;
  category: TransactionCategory;
}

export interface CreateTransactionData {
  amount: number;
  type: 'income' | 'expense';
  description: string;
  notes?: string;
  date: string;
  categoryId: string;
  image?: string;
}

export interface UpdateTransactionData {
  amount?: number;
  type?: 'income' | 'expense';
  description?: string;
  notes?: string;
  date?: string;
  categoryId?: string;
  image?: string;
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export const transactionService = {
  /**
   * Get transactions with optional filters
   * @param filters - Optional filters for transactions
   * @returns Promise<Transaction[]>
   */
  getTransactions: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    try {
      console.log('Fetching transactions with filters:', filters);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = queryString ? `/transactions?${queryString}` : '/transactions';
      
      const response = await apiClient.get<Transaction[]>(url);
      console.log('Transactions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Get transactions by type (income or expense)
   * @param type - Transaction type
   * @returns Promise<Transaction[]>
   */
  getTransactionsByType: async (type: 'income' | 'expense'): Promise<Transaction[]> => {
    return transactionService.getTransactions({ type });
  },

  /**
   * Get expense transactions
   * @returns Promise<Transaction[]>
   */
  getExpenseTransactions: async (): Promise<Transaction[]> => {
    return transactionService.getTransactionsByType('expense');
  },

  /**
   * Get income transactions
   * @returns Promise<Transaction[]>
   */
  getIncomeTransactions: async (): Promise<Transaction[]> => {
    return transactionService.getTransactionsByType('income');
  },

  /**
   * Get a specific transaction by ID
   * @param transactionId - The transaction ID
   * @returns Promise<Transaction>
   */
  getTransactionById: async (transactionId: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get<Transaction>(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  /**
   * Create a new transaction
   * @param transactionData - The transaction data
   * @returns Promise<Transaction>
   */
  createTransaction: async (transactionData: CreateTransactionData): Promise<Transaction> => {
    try {
      console.log('transactionService.createTransaction - Sending data:', transactionData);
      console.log('transactionService.createTransaction - Data type:', typeof transactionData);
      console.log('transactionService.createTransaction - Data keys:', Object.keys(transactionData));
      
      const response = await apiClient.post<Transaction>('/transactions', transactionData);
      console.log('transactionService.createTransaction - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('transactionService.createTransaction - Error details:', error);
      console.error('transactionService.createTransaction - Error response:', error.response?.data);
      console.error('transactionService.createTransaction - Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Update a transaction
   * @param transactionId - The transaction ID
   * @param transactionData - The updated transaction data
   * @returns Promise<Transaction>
   */
  updateTransaction: async (transactionId: string, transactionData: UpdateTransactionData): Promise<Transaction> => {
    try {
      const response = await apiClient.put<Transaction>(`/transactions/${transactionId}`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  /**
   * Delete a transaction
   * @param transactionId - The transaction ID
   * @returns Promise<void>
   */
  deleteTransaction: async (transactionId: string): Promise<void> => {
    try {
      await apiClient.delete(`/transactions/${transactionId}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};
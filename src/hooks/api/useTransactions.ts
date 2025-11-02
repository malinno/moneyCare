import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { transactionService, Transaction, CreateTransactionData, UpdateTransactionData, TransactionFilters } from '@services/api/transactionService';

export interface UseTransactionsOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export const useTransactions = (filters?: TransactionFilters, options?: UseTransactionsOptions): UseQueryResult<Transaction[], Error> => {
  const {
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes (shorter than categories)
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options || {};

  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
    enabled,
    staleTime,
    cacheTime,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) errors
      if (error && error.status === 401) {
        console.log('401 error - user not authenticated, disabling query');
        return false;
      }
      // Don't retry on "No refresh token available" errors
      if (error && error.message && error.message.includes('No refresh token available')) {
        console.log('No refresh token - user not authenticated, disabling query');
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    onError: (error: any) => {
      console.error('Error fetching transactions:', error);
    },
  });
};

// Hook to get transactions by type
export const useTransactionsByType = (type: 'income' | 'expense', options?: UseTransactionsOptions): UseQueryResult<Transaction[], Error> => {
  return useTransactions({ type }, options);
};

// Hook to get expense transactions only
export const useExpenseTransactions = (options?: UseTransactionsOptions): UseQueryResult<Transaction[], Error> => {
  return useTransactionsByType('expense', options);
};

// Hook to get income transactions only
export const useIncomeTransactions = (options?: UseTransactionsOptions): UseQueryResult<Transaction[], Error> => {
  return useTransactionsByType('income', options);
};

// Hook to get a specific transaction by ID
export const useTransaction = (transactionId: string, options?: UseTransactionsOptions): UseQueryResult<Transaction, Error> => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options || {};

  return useQuery({
    queryKey: ['transactions', transactionId],
    queryFn: () => transactionService.getTransactionById(transactionId),
    enabled: enabled && !!transactionId,
    staleTime,
    cacheTime,
    retry: (failureCount, error: any) => {
      if (error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: any) => {
      console.error('Error fetching transaction:', error);
    },
  });
};

// Mutation hooks
export const useCreateTransaction = (): UseMutationResult<Transaction, Error, CreateTransactionData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: (newTransaction) => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      console.log('Transaction created successfully:', newTransaction);
    },
    onError: (error: any) => {
      console.error('Error creating transaction:', error);
    },
  });
};

export const useUpdateTransaction = (): UseMutationResult<Transaction, Error, { transactionId: string; data: UpdateTransactionData }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, data }) => transactionService.updateTransaction(transactionId, data),
    onSuccess: (updatedTransaction) => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', updatedTransaction.id] });
      console.log('Transaction updated successfully:', updatedTransaction);
    },
    onError: (error: any) => {
      console.error('Error updating transaction:', error);
    },
  });
};

export const useDeleteTransaction = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: (_, transactionId) => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['transactions', transactionId] });
      console.log('Transaction deleted successfully:', transactionId);
    },
    onError: (error: any) => {
      console.error('Error deleting transaction:', error);
    },
  });
};
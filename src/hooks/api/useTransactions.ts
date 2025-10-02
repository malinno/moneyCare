import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { transactionService } from "@services/api/transactionService";
import { queryKeys, invalidateQueries } from "@config/queryClient";
import {
  Transaction,
  CreateTransactionData,
  PaginatedResponse,
} from "@types/index";

// Get transactions with pagination
export const useTransactions = (params?: {
  page?: number;
  limit?: number;
  filters?: any;
}) => {
  return useQuery({
    queryKey: queryKeys.transactions.list(params?.filters),
    queryFn: () => transactionService.getTransactions(params || {}),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Infinite query for transactions (for infinite scroll)
export const useInfiniteTransactions = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      transactionService.getTransactions({
        page: pageParam,
        limit: 20,
        filters,
      }),
    getNextPageParam: (lastPage: PaginatedResponse<Transaction>) => {
      return lastPage.pagination.hasNext
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
};

// Get single transaction
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionService.getTransactionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get recent transactions
export const useRecentTransactions = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.transactions.recent(limit),
    queryFn: () => transactionService.getRecentTransactions(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get transaction statistics
export const useTransactionStats = (params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month" | "year";
}) => {
  return useQuery({
    queryKey: queryKeys.transactions.stats(params),
    queryFn: () => transactionService.getTransactionStats(params || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search transactions
export const useSearchTransactions = (query: string, limit: number = 20) => {
  return useQuery({
    queryKey: [...queryKeys.transactions.all, "search", { query, limit }],
    queryFn: () => transactionService.searchTransactions(query, limit),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Create transaction mutation
export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (data: CreateTransactionData) =>
      transactionService.createTransaction(data),
    onSuccess: () => {
      // Invalidate and refetch transaction queries
      invalidateQueries.transactions();
      // Also invalidate related data
      invalidateQueries.budgets();
      invalidateQueries.accounts();
    },
    onError: (error) => {
      console.error("Create transaction failed:", error);
    },
  });
};

// Update transaction mutation
export const useUpdateTransaction = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTransactionData>;
    }) => transactionService.updateTransaction(id, data),
    onSuccess: (updatedTransaction) => {
      // Invalidate transaction queries
      invalidateQueries.transactions();
      invalidateQueries.transaction(updatedTransaction.id);
      // Also invalidate related data
      invalidateQueries.budgets();
      invalidateQueries.accounts();
    },
    onError: (error) => {
      console.error("Update transaction failed:", error);
    },
  });
};

// Delete transaction mutation
export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      // Invalidate transaction queries
      invalidateQueries.transactions();
      // Also invalidate related data
      invalidateQueries.budgets();
      invalidateQueries.accounts();
    },
    onError: (error) => {
      console.error("Delete transaction failed:", error);
    },
  });
};

// Bulk delete transactions mutation
export const useBulkDeleteTransactions = () => {
  return useMutation({
    mutationFn: (ids: string[]) =>
      transactionService.bulkDeleteTransactions(ids),
    onSuccess: () => {
      // Invalidate transaction queries
      invalidateQueries.transactions();
      // Also invalidate related data
      invalidateQueries.budgets();
      invalidateQueries.accounts();
    },
    onError: (error) => {
      console.error("Bulk delete transactions failed:", error);
    },
  });
};

// Export transactions mutation
export const useExportTransactions = () => {
  return useMutation({
    mutationFn: (params: {
      format: "csv" | "xlsx" | "pdf";
      startDate?: string;
      endDate?: string;
      categoryIds?: string[];
    }) => transactionService.exportTransactions(params),
    onError: (error) => {
      console.error("Export transactions failed:", error);
    },
  });
};

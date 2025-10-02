import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@types/index";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === "object" && "status" in error) {
          const apiError = error as ApiError;
          if (apiError.status >= 400 && apiError.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations 1 time
      retry: 1,
      // Retry delay
      retryDelay: 1000,
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },

  // Transactions
  transactions: {
    all: ["transactions"] as const,
    lists: () => [...queryKeys.transactions.all, "list"] as const,
    list: (filters?: any) =>
      [...queryKeys.transactions.lists(), { filters }] as const,
    details: () => [...queryKeys.transactions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
    stats: (params?: any) =>
      [...queryKeys.transactions.all, "stats", { params }] as const,
    recent: (limit?: number) =>
      [...queryKeys.transactions.all, "recent", { limit }] as const,
  },

  // Budgets
  budgets: {
    all: ["budgets"] as const,
    lists: () => [...queryKeys.budgets.all, "list"] as const,
    list: (filters?: any) =>
      [...queryKeys.budgets.lists(), { filters }] as const,
    details: () => [...queryKeys.budgets.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.budgets.details(), id] as const,
    progress: (id: string) =>
      [...queryKeys.budgets.all, "progress", id] as const,
    alerts: () => [...queryKeys.budgets.all, "alerts"] as const,
    stats: (params?: any) =>
      [...queryKeys.budgets.all, "stats", { params }] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (type?: "income" | "expense") =>
      [...queryKeys.categories.lists(), { type }] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
    stats: (params?: any) =>
      [...queryKeys.categories.all, "stats", { params }] as const,
  },

  // Accounts
  accounts: {
    all: ["accounts"] as const,
    lists: () => [...queryKeys.accounts.all, "list"] as const,
    list: (filters?: any) =>
      [...queryKeys.accounts.lists(), { filters }] as const,
    details: () => [...queryKeys.accounts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.accounts.details(), id] as const,
    balanceHistory: (id: string, params?: any) =>
      [...queryKeys.accounts.all, "balance-history", id, { params }] as const,
    transactions: (id: string, params?: any) =>
      [...queryKeys.accounts.all, "transactions", id, { params }] as const,
    summary: () => [...queryKeys.accounts.all, "summary"] as const,
  },
} as const;

// Utility functions for cache invalidation
export const invalidateQueries = {
  // Invalidate all transaction queries
  transactions: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
  },

  // Invalidate specific transaction
  transaction: (id: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.transactions.detail(id),
    });
  },

  // Invalidate all budget queries
  budgets: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
  },

  // Invalidate specific budget
  budget: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.detail(id) });
  },

  // Invalidate all category queries
  categories: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
  },

  // Invalidate all account queries
  accounts: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
  },

  // Invalidate specific account
  account: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.detail(id) });
  },

  // Invalidate user data
  user: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
  },

  // Invalidate all data (useful after login/logout)
  all: () => {
    queryClient.invalidateQueries();
  },
};

// Utility functions for cache updates
export const updateCache = {
  // Update transaction in cache
  transaction: (id: string, updater: (old: any) => any) => {
    queryClient.setQueryData(queryKeys.transactions.detail(id), updater);
  },

  // Update budget in cache
  budget: (id: string, updater: (old: any) => any) => {
    queryClient.setQueryData(queryKeys.budgets.detail(id), updater);
  },

  // Update user in cache
  user: (updater: (old: any) => any) => {
    queryClient.setQueryData(queryKeys.auth.user, updater);
  },
};

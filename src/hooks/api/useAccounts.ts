import { useQuery, useMutation } from "@tanstack/react-query";
import { accountService } from "@services/api/accountService";
import { queryKeys, invalidateQueries } from "@config/queryClient";
import { Account, CreateAccountData } from "@types/index";

// Get all accounts
export const useAccounts = () => {
  return useQuery({
    queryKey: queryKeys.accounts.lists(),
    queryFn: accountService.getAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single account
export const useAccount = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => accountService.getAccountById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get account summary (total balances, etc.)
export const useAccountSummary = () => {
  return useQuery({
    queryKey: queryKeys.accounts.summary(),
    queryFn: accountService.getAccountSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get account balance history
export const useAccountBalanceHistory = (
  id: string,
  params?: {
    startDate?: string;
    endDate?: string;
    interval?: "day" | "week" | "month";
  }
) => {
  return useQuery({
    queryKey: queryKeys.accounts.balanceHistory(id, params),
    queryFn: () => accountService.getAccountBalanceHistory(id, params || {}),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get account transactions
export const useAccountTransactions = (
  id: string,
  params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: queryKeys.accounts.transactions(id, params),
    queryFn: () => accountService.getAccountTransactions(id, params || {}),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create account mutation
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (data: CreateAccountData) => accountService.createAccount(data),
    onSuccess: () => {
      // Invalidate account queries
      invalidateQueries.accounts();
    },
    onError: (error) => {
      console.error("Create account failed:", error);
    },
  });
};

// Update account mutation
export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAccountData>;
    }) => accountService.updateAccount(id, data),
    onSuccess: (updatedAccount) => {
      // Invalidate account queries
      invalidateQueries.accounts();
      invalidateQueries.account(updatedAccount.id);
    },
    onError: (error) => {
      console.error("Update account failed:", error);
    },
  });
};

// Delete account mutation
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      // Invalidate account queries
      invalidateQueries.accounts();
      // Also invalidate transactions as they might be affected
      invalidateQueries.transactions();
    },
    onError: (error) => {
      console.error("Delete account failed:", error);
    },
  });
};

// Transfer between accounts mutation
export const useTransferBetweenAccounts = () => {
  return useMutation({
    mutationFn: (data: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      description?: string;
    }) => accountService.transferBetweenAccounts(data),
    onSuccess: () => {
      // Invalidate account and transaction queries
      invalidateQueries.accounts();
      invalidateQueries.transactions();
    },
    onError: (error) => {
      console.error("Transfer between accounts failed:", error);
    },
  });
};

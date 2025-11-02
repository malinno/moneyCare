import { useQuery, useMutation } from "@tanstack/react-query";
import { budgetService } from "@services/api/budgetService";
import { queryKeys, invalidateQueries } from "@config/queryClient";
import { Budget, CreateBudgetData } from "@/types/index";

// Get all budgets
export const useBudgets = () => {
  return useQuery({
    queryKey: queryKeys.budgets.lists(),
    queryFn: budgetService.getBudgets,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single budget
export const useBudget = (id: string) => {
  return useQuery({
    queryKey: queryKeys.budgets.detail(id),
    queryFn: () => budgetService.getBudgetById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get budget progress
export const useBudgetProgress = (id: string) => {
  return useQuery({
    queryKey: queryKeys.budgets.progress(id),
    queryFn: () => budgetService.getBudgetProgress(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for progress
  });
};

// Get active budgets
export const useActiveBudgets = () => {
  return useQuery({
    queryKey: [...queryKeys.budgets.all, "active"],
    queryFn: budgetService.getActiveBudgets,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get budget alerts
export const useBudgetAlerts = () => {
  return useQuery({
    queryKey: queryKeys.budgets.alerts(),
    queryFn: budgetService.getBudgetAlerts,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get budget statistics
export const useBudgetStats = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.budgets.stats(params),
    queryFn: () => budgetService.getBudgetStats(params || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create budget mutation
export const useCreateBudget = () => {
  return useMutation({
    mutationFn: (data: CreateBudgetData) => budgetService.createBudget(data),
    onSuccess: () => {
      // Invalidate budget queries
      invalidateQueries.budgets();
    },
    onError: (error) => {
      console.error("Create budget failed:", error);
    },
  });
};

// Update budget mutation
export const useUpdateBudget = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateBudgetData>;
    }) => budgetService.updateBudget(id, data),
    onSuccess: (updatedBudget) => {
      // Invalidate budget queries
      invalidateQueries.budgets();
      invalidateQueries.budget(updatedBudget.id);
    },
    onError: (error) => {
      console.error("Update budget failed:", error);
    },
  });
};

// Delete budget mutation
export const useDeleteBudget = () => {
  return useMutation({
    mutationFn: (id: string) => budgetService.deleteBudget(id),
    onSuccess: () => {
      // Invalidate budget queries
      invalidateQueries.budgets();
    },
    onError: (error) => {
      console.error("Delete budget failed:", error);
    },
  });
};

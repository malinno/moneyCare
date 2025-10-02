import { useQuery, useMutation } from "@tanstack/react-query";
import { categoryService } from "@services/api/categoryService";
import { queryKeys, invalidateQueries } from "@config/queryClient";
import { Category, CreateCategoryData } from "@types/index";

// Get all categories
export const useCategories = (type?: "income" | "expense") => {
  return useQuery({
    queryKey: queryKeys.categories.list(type),
    queryFn: () => categoryService.getCategories(type),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });
};

// Get income categories
export const useIncomeCategories = () => {
  return useCategories("income");
};

// Get expense categories
export const useExpenseCategories = () => {
  return useCategories("expense");
};

// Get single category
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get category statistics
export const useCategoryStats = (params?: {
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
}) => {
  return useQuery({
    queryKey: queryKeys.categories.stats(params),
    queryFn: () => categoryService.getCategoryStats(params || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get popular categories
export const usePopularCategories = (
  type?: "income" | "expense",
  limit: number = 10
) => {
  return useQuery({
    queryKey: [...queryKeys.categories.all, "popular", { type, limit }],
    queryFn: () => categoryService.getPopularCategories(type, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create category mutation
export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data: CreateCategoryData) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      // Invalidate category queries
      invalidateQueries.categories();
    },
    onError: (error) => {
      console.error("Create category failed:", error);
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCategoryData>;
    }) => categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Invalidate category queries
      invalidateQueries.categories();
    },
    onError: (error) => {
      console.error("Update category failed:", error);
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      // Invalidate category queries
      invalidateQueries.categories();
      // Also invalidate transactions as they might be affected
      invalidateQueries.transactions();
    },
    onError: (error) => {
      console.error("Delete category failed:", error);
    },
  });
};

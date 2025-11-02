import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { categoryService, Category, CreateCategoryData, UpdateCategoryData } from '@services/api/categoryService';

export interface UseCategoriesOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export const useCategories = (options?: UseCategoriesOptions): UseQueryResult<Category[], Error> => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options || {};

  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
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
      console.error('Error fetching categories:', error);
    },
  });
};

// Hook to get categories by type
export const useCategoriesByType = (type: 'income' | 'expense', options?: UseCategoriesOptions): UseQueryResult<Category[], Error> => {
  const { data: categories = [], ...rest } = useCategories(options);
  const filteredCategories = categories.filter(category => category.type === type);
  
  return {
    data: filteredCategories,
    ...rest
  } as UseQueryResult<Category[], Error>;
};

// Hook to get expense categories only
export const useExpenseCategories = (options?: UseCategoriesOptions): Category[] => {
  return useCategoriesByType('expense', options);
};

// Hook to get income categories only
export const useIncomeCategories = (options?: UseCategoriesOptions): Category[] => {
  return useCategoriesByType('income', options);
};

// Hook to get a specific category by ID
export const useCategory = (categoryId: string, options?: UseCategoriesOptions): UseQueryResult<Category, Error> => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options || {};

  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
    enabled: enabled && !!categoryId,
    staleTime,
    cacheTime,
    retry: (failureCount, error: any) => {
      if (error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: any) => {
      console.error('Error fetching category:', error);
    },
  });
};

// Mutation hooks
export const useCreateCategory = (): UseMutationResult<Category, Error, CreateCategoryData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      console.log('Category created successfully:', newCategory);
    },
    onError: (error: any) => {
      console.error('Error creating category:', error);
    },
  });
};

export const useUpdateCategory = (): UseMutationResult<Category, Error, { categoryId: string; data: UpdateCategoryData }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }) => categoryService.updateCategory(categoryId, data),
    onSuccess: (updatedCategory) => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', updatedCategory._id] });
      console.log('Category updated successfully:', updatedCategory);
    },
    onError: (error: any) => {
      console.error('Error updating category:', error);
    },
  });
};

export const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (_, categoryId) => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.removeQueries({ queryKey: ['categories', categoryId] });
      console.log('Category deleted successfully:', categoryId);
    },
    onError: (error: any) => {
      console.error('Error deleting category:', error);
    },
  });
};
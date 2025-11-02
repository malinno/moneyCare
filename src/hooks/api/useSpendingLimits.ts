import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  spendingLimitService, 
  SpendingLimit, 
  CreateSpendingLimitData, 
  UpdateSpendingLimitData 
} from '../../services/api/spendingLimitService';

export const useSpendingLimits = () => {
  return useQuery<SpendingLimit[], Error>({
    queryKey: ['spendingLimits'],
    queryFn: spendingLimitService.getSpendingLimits,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useSpendingLimit = (id: string) => {
  return useQuery<SpendingLimit, Error>({
    queryKey: ['spendingLimit', id],
    queryFn: () => spendingLimitService.getSpendingLimitById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useCreateSpendingLimit = () => {
  const queryClient = useQueryClient();

  return useMutation<SpendingLimit, Error, CreateSpendingLimitData>({
    mutationFn: spendingLimitService.createSpendingLimit,
    onSuccess: () => {
      // Invalidate and refetch spending limits
      queryClient.invalidateQueries({ queryKey: ['spendingLimits'] });
      // Also invalidate dashboard data as it might include spending limits
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateSpendingLimit = () => {
  const queryClient = useQueryClient();

  return useMutation<SpendingLimit, Error, { id: string; data: UpdateSpendingLimitData }>({
    mutationFn: ({ id, data }) => spendingLimitService.updateSpendingLimit(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch spending limits
      queryClient.invalidateQueries({ queryKey: ['spendingLimits'] });
      // Update specific spending limit in cache
      queryClient.setQueryData(['spendingLimit', data._id], data);
      // Also invalidate dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteSpendingLimit = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: spendingLimitService.deleteSpendingLimit,
    onSuccess: (_, id) => {
      // Invalidate and refetch spending limits
      queryClient.invalidateQueries({ queryKey: ['spendingLimits'] });
      // Remove specific spending limit from cache
      queryClient.removeQueries({ queryKey: ['spendingLimit', id] });
      // Also invalidate dashboard data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};




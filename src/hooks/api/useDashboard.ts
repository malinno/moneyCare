import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardData } from '../../services/api/dashboardService';

export const useDashboard = (period?: string) => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard', period],
    queryFn: () => dashboardService.getDashboard(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

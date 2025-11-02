import { useQuery } from '@tanstack/react-query';
import { dashboardService, PeriodOption } from '../../services/api/dashboardService';

export const useDashboardPeriods = () => {
  return useQuery<PeriodOption[], Error>({
    queryKey: ['dashboardPeriods'],
    queryFn: dashboardService.getDashboardPeriods,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

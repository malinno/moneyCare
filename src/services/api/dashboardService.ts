import { apiClient } from '@config/api';

export interface DataPoint {
  date: string;
  amount: number;
}

export interface MonthlySummary {
  totalSpent: number;
  balance: number;
  monthlyIncome: number;
}

export interface SpendingTrend {
  period: string;
  totalSpent: number;
  dataPoints: DataPoint[];
}

export interface DashboardData {
  greeting: string;
  monthlySummary: MonthlySummary;
  spendingTrend: SpendingTrend;
  spendingByCategory: any[];
  recentTransactions: any[];
  spendingLimits: any[];
}

export interface PeriodOption {
  value: string;
  label: string;
}

export const dashboardService = {
  /**
   * Get dashboard data
   * @param period - Period to filter data (optional)
   * @returns Promise<DashboardData>
   */
  getDashboard: async (period?: string): Promise<DashboardData> => {
    try {
      
      const params = period ? { period } : {};
      const response = await apiClient.get<DashboardData>('/dashboard', { params });      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get available dashboard periods
   * @returns Promise<PeriodOption[]>
   */
  getDashboardPeriods: async (): Promise<PeriodOption[]> => {
    try {
      console.log('dashboardService.getDashboardPeriods - Fetching dashboard periods');
      
      const response = await apiClient.get<PeriodOption[]>('/dashboard/periods');
      console.log('dashboardService.getDashboardPeriods - Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('dashboardService.getDashboardPeriods - Error:', error);
      throw error;
    }
  },
};

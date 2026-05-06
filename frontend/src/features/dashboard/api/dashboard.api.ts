import { apiClient } from '@/services/http/apiClient';
import type { DashboardSummary } from '../model/dashboard.types';

export const dashboardApi = {
  getSummary: async () => {
    const response = await apiClient.get<DashboardSummary>('/dashboard');
    return response.data;
  },
};
import { apiClient } from '@/services/http/apiClient';
import type { LookupOption } from '../model/class.types';

export const classLookupsApi = {
  staff: async () => {
    const response = await apiClient.get<LookupOption[]>('/staff');
    return response.data;
  },
  shifts: async () => {
    const response = await apiClient.get<LookupOption[]>('/shifts');
    return response.data;
  },
};

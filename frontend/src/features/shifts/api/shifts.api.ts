import { apiClient } from '@/services/http/apiClient';
import type { Shift, ShiftInput } from '../model/shift.types';

export const shiftsApi = {
  list: async () => {
    const response = await apiClient.get<Shift[]>('/shifts');
    return response.data;
  },
  create: async (payload: ShiftInput) => {
    const response = await apiClient.post<Shift>('/shifts', payload);
    return response.data;
  },
  update: async (id: number, payload: ShiftInput) => {
    const response = await apiClient.put<void>(`/shifts/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/shifts/${id}`);
    return response.data;
  },
};

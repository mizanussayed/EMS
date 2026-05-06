import { apiClient } from '@/services/http/apiClient';
import type { ClassInput, SchoolClass } from '../model/class.types';

export const classesApi = {
  list: async () => {
    const response = await apiClient.get<SchoolClass[]>('/classes');
    return response.data;
  },
  create: async (payload: ClassInput) => {
    const response = await apiClient.post<SchoolClass>('/classes', payload);
    return response.data;
  },
  update: async (id: number, payload: ClassInput) => {
    const response = await apiClient.put<void>(`/classes/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/classes/${id}`);
    return response.data;
  },
};

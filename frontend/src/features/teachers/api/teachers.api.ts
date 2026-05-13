import { apiClient } from '@/services/http/apiClient';
import type { Teacher, TeacherInput } from '../model/teacher.types';

export const teachersApi = {
  list: async () => {
    const response = await apiClient.get<Teacher[]>('/staff');
    return response.data;
  },
  create: async (payload: TeacherInput) => {
    const response = await apiClient.post<Teacher>('/staff', payload);
    return response.data;
  },
  update: async (id: number, payload: TeacherInput) => {
    const response = await apiClient.put<Teacher>(`/staff/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/staff/${id}`);
    return response.data;
  },
};
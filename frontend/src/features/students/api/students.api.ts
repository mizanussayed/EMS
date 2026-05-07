import { apiClient } from '@/services/http/apiClient';
import type { ApiStudent, StudentInput } from '../model/student.types';

export const studentsApi = {
  list: async () => {
    const response = await apiClient.get<ApiStudent[]>('/students');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiStudent>(`/students/${id}`);
    return response.data;
  },
  create: async (payload: StudentInput) => {
    const response = await apiClient.post<ApiStudent>('/students', payload);
    return response.data;
  },
  update: async (id: number, payload: StudentInput) => {
    const response = await apiClient.put<ApiStudent>(`/students/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/students/${id}`);
    return response.data;
  },
  listAttendance: async (className: string) => {
    const response = await apiClient.get(`/attendance/${encodeURIComponent(className)}`);
    return response.data as any[];
  },
};
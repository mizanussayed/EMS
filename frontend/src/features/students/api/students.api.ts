import { apiClient } from '@/services/http/apiClient';
import type { Student, StudentInput } from '../model/student.types';

export const studentsApi = {
  list: async () => {
    const response = await apiClient.get<Student[]>('/students');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },
  create: async (payload: StudentInput) => {
    const response = await apiClient.post<Student>('/students', payload);
    return response.data;
  },
  update: async (id: number, payload: StudentInput) => {
    const response = await apiClient.put<Student>(`/students/${id}`, payload);
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
import { apiClient } from '@/services/http/apiClient';
import type { Subject, SubjectInput } from '../model/subject.types';

export const subjectsApi = {
  list: async () => {
    const response = await apiClient.get<Subject[]>('/subjects');
    return response.data;
  },
  create: async (payload: SubjectInput) => {
    const response = await apiClient.post<Subject>('/subjects', payload);
    return response.data;
  },
  update: async (id: number, payload: SubjectInput) => {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/subjects/${id}`);
    return response.data;
  },
};
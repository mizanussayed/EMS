import { apiClient } from '@/services/http/apiClient';
import type { StudentBadge } from '../model/badge.types';

export type BadgeInput = Omit<StudentBadge, 'id' | 'studentCount'>;

export const badgesApi = {
  list: async () => {
    const response = await apiClient.get<StudentBadge[]>('/badges');
    return response.data;
  },
  create: async (payload: BadgeInput) => {
    const response = await apiClient.post<StudentBadge>('/badges', payload);
    return response.data;
  },
  update: async (id: number, payload: BadgeInput) => {
    const response = await apiClient.put<StudentBadge>(`/badges/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/badges/${id}`);
    return response.data;
  },
};
import { apiClient } from '@/services/http/apiClient';
import type { StudentClass, TimetableEntry, TimetableInput } from '../model/timetable.types';

export const timetableApi = {
  listClasses: async () => {
    const response = await apiClient.get<StudentClass[]>('/students');
    return response.data;
  },
  listEntries: async (className: string) => {
    const response = await apiClient.get<TimetableEntry[]>(`/timetable/${encodeURIComponent(className)}`);
    return response.data;
  },
  create: async (payload: TimetableInput) => {
    const response = await apiClient.post<TimetableEntry>('/timetable', payload);
    return response.data;
  },
  update: async (id: number, payload: TimetableInput) => {
    const response = await apiClient.put<TimetableEntry>(`/timetable/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/timetable/${id}`);
    return response.data;
  },
};
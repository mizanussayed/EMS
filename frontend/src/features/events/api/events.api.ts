import { apiClient } from '@/services/http/apiClient';
import type { EventItem } from '../model/event.types';

export type EventInput = Omit<EventItem, 'id'>;

export const eventsApi = {
  list: async () => {
    const response = await apiClient.get<EventItem[]>('/events');
    return response.data;
  },
  create: async (payload: EventInput) => {
    const response = await apiClient.post<EventItem>('/events', payload);
    return response.data;
  },
  update: async (id: number, payload: EventInput) => {
    const response = await apiClient.put<EventItem>(`/events/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/events/${id}`);
    return response.data;
  },
};
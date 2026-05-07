import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi, type EventInput } from '../api/events.api';

const eventsKey = ['events'];

export function useEvents() {
  return useQuery({
    queryKey: eventsKey,
    queryFn: eventsApi.list,
  });
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EventInput) => eventsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EventInput }) => eventsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timetableApi } from '../api/timetable.api';
import type { TimetableInput } from '../model/timetable.types';

const timetableKey = ['timetable'];

export function useTimetableClasses() {
  return useQuery({
    queryKey: ['timetable', 'classes'],
    queryFn: timetableApi.listClasses,
  });
}

export function useTimetableEntries(className: string) {
  return useQuery({
    queryKey: [...timetableKey, className],
    queryFn: () => timetableApi.listEntries(className),
    enabled: Boolean(className),
  });
}

export function useCreateTimetableMutation(className: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TimetableInput) => timetableApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...timetableKey, className] });
    },
  });
}

export function useUpdateTimetableMutation(className: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TimetableInput }) => timetableApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...timetableKey, className] });
    },
  });
}

export function useDeleteTimetableMutation(className: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => timetableApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...timetableKey, className] });
    },
  });
}
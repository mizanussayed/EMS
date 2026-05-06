import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shiftsApi } from '../api/shifts.api';
import type { ShiftInput } from '../model/shift.types';

const shiftsKey = ['shifts'];

export function useShifts() {
  return useQuery({
    queryKey: shiftsKey,
    queryFn: shiftsApi.list,
  });
}

export function useCreateShiftMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShiftInput) => shiftsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftsKey });
    },
  });
}

export function useUpdateShiftMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ShiftInput }) => shiftsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftsKey });
    },
  });
}

export function useDeleteShiftMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shiftsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftsKey });
    },
  });
}

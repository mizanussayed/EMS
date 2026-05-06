import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { classLookupsApi } from '../api/lookups.api';
import type { ClassInput } from '../model/class.types';

const classesKey = ['classes'];

export function useClasses() {
  return useQuery({
    queryKey: classesKey,
    queryFn: classesApi.list,
  });
}

export function useClassLookups() {
  const staffQuery = useQuery({
    queryKey: ['classes', 'staff'],
    queryFn: classLookupsApi.staff,
  });

  const shiftsQuery = useQuery({
    queryKey: ['classes', 'shifts'],
    queryFn: classLookupsApi.shifts,
  });

  return {
    staffQuery,
    shiftsQuery,
  };
}

export function useCreateClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClassInput) => classesApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classesKey });
    },
  });
}

export function useUpdateClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClassInput }) => classesApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classesKey });
    },
  });
}

export function useDeleteClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => classesApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classesKey });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import type { TeacherInput } from '../model/teacher.types';

const teachersKey = ['teachers'];

export function useTeachers() {
  return useQuery({
    queryKey: teachersKey,
    queryFn: teachersApi.list,
  });
}

export function useCreateTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeacherInput) => teachersApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teachersKey });
    },
  });
}

export function useUpdateTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TeacherInput }) => teachersApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teachersKey });
    },
  });
}

export function useDeleteTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teachersApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teachersKey });
    },
  });
}
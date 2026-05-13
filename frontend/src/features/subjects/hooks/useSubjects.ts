import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import type { SubjectInput } from '../model/subject.types';

const subjectsKey = ['subjects'];

export function useSubjects() {
  return useQuery({
    queryKey: subjectsKey,
    queryFn: subjectsApi.list,
  });
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubjectInput) => subjectsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectsKey });
    },
  });
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SubjectInput }) => subjectsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectsKey });
    },
  });
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subjectsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectsKey });
    },
  });
}
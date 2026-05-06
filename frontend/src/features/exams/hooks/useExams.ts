import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamInput } from '../model/exam.types';

const examsKey = ['exams'] as const;

export function useExams() {
  return useQuery({
    queryKey: examsKey,
    queryFn: examsApi.list,
  });
}

export function useExamResults(examId: number | null) {
  return useQuery({
    queryKey: ['exams', examId, 'results'] as const,
    queryFn: () => examsApi.results(examId as number),
    enabled: examId !== null,
  });
}

export function useCreateExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExamInput) => examsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: examsKey });
    },
  });
}

export function useUpdateExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ExamInput }) => examsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: examsKey });
    },
  });
}

export function useDeleteExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: examsKey });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import type { StudentInput } from '../model/student.types';

const studentsKey = ['students'];

export function useStudents() {
  return useQuery({
    queryKey: studentsKey,
    queryFn: studentsApi.list,
  });
}

export function useStudent(id: string | undefined) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsApi.getById(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StudentInput) => studentsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentsKey });
    },
  });
}

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StudentInput }) => studentsApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentsKey });
    },
  });
}

export function useDeleteStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentsKey });
    },
  });
}

export function useAttendanceByClass(className: string | undefined) {
  return useQuery({
    queryKey: ['attendance', className],
    queryFn: () => studentsApi.listAttendance(className ?? ''),
    enabled: Boolean(className),
  });
}
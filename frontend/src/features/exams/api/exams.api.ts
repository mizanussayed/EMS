import { apiClient } from '@/services/http/apiClient';
import type { Exam, ExamInput, ExamResult } from '../model/exam.types';

export const examsApi = {
  list: async () => {
    const response = await apiClient.get<Exam[]>('/exams');
    return response.data;
  },
  results: async (examId: number) => {
    const response = await apiClient.get<ExamResult[]>(`/exams/${examId}/results`);
    return response.data;
  },
  create: async (payload: ExamInput) => {
    const response = await apiClient.post<Exam>('/exams', payload);
    return response.data;
  },
  update: async (id: number, payload: ExamInput) => {
    const response = await apiClient.put<void>(`/exams/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/exams/${id}`);
    return response.data;
  },
};

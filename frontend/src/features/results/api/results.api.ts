import { apiClient } from '@/services/http/apiClient';
import type { Exam, Result } from '../model/result.types';

export const resultsApi = {
  listExams: async () => {
    const response = await apiClient.get<Exam[]>('/exams');
    return response.data;
  },
  listResults: async (examId: number) => {
    const response = await apiClient.get<Result[]>(`/exams/${examId}/results`);
    return response.data;
  },
};
import { useQuery } from '@tanstack/react-query';
import { resultsApi } from '../api/results.api';

const examsKey = ['exams'];

export function useExams() {
  return useQuery({
    queryKey: examsKey,
    queryFn: resultsApi.listExams,
  });
}

export function useExamResults(examId: number | '') {
  return useQuery({
    queryKey: ['exams', examId, 'results'],
    queryFn: () => resultsApi.listResults(Number(examId)),
    enabled: examId !== '',
  });
}
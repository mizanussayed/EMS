import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { libraryApi, type BookInput, type IssueInput } from '../api/library.api';

const libraryKey = ['library'];

export function useLibrary() {
  return useQuery({
    queryKey: libraryKey,
    queryFn: libraryApi.getSummary,
  });
}

export function useCreateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookInput) => libraryApi.createBook(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryKey });
    },
  });
}

export function useIssueBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IssueInput) => libraryApi.issueBook(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryKey });
    },
  });
}

export function useReturnBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => libraryApi.returnBook(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryKey });
    },
  });
}
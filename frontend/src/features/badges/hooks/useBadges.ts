import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { badgesApi, type BadgeInput } from '../api/badges.api';

const badgesKey = ['badges'];

export function useBadges() {
  return useQuery({
    queryKey: badgesKey,
    queryFn: badgesApi.list,
  });
}

export function useCreateBadgeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BadgeInput) => badgesApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: badgesKey });
    },
  });
}

export function useUpdateBadgeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BadgeInput }) => badgesApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: badgesKey });
    },
  });
}

export function useDeleteBadgeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => badgesApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: badgesKey });
    },
  });
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feesApi, type FeePaymentInput } from '../api/fees.api';

const feesKey = ['fees'];

export function useFees() {
  return useQuery({
    queryKey: feesKey,
    queryFn: feesApi.list,
  });
}

export function usePayFeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FeePaymentInput }) => feesApi.pay(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feesKey });
    },
  });
}
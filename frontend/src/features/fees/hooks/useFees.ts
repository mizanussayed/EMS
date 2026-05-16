import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feesApi, feeStructuresApi } from '../api/fees.api';
import { FeePaymentInput, CreateFeeStructureInput, UpdateFeeStructureInput } from '../model/fee.types';

const feesKey = ['fees'];
const feeStructuresKey = ['feeStructures'];

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

export function useFeeStructures() {
  return useQuery({
    queryKey: feeStructuresKey,
    queryFn: feeStructuresApi.list,
  });
}

export function useFeeStructuresByClass(classId: number) {
  return useQuery({
    queryKey: [...feeStructuresKey, classId],
    queryFn: () => feeStructuresApi.getByClass(classId),
    enabled: !!classId,
  });
}

export function useCreateFeeStructureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeeStructureInput) => feeStructuresApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feeStructuresKey });
    },
  });
}

export function useUpdateFeeStructureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFeeStructureInput }) =>
      feeStructuresApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feeStructuresKey });
    },
  });
}

export function useDeleteFeeStructureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => feeStructuresApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: feeStructuresKey });
    },
  });
}
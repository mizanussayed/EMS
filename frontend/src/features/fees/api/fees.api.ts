import { apiClient } from '@/services/http/apiClient';
import type { FeePaymentInput, FeeRecord, FeeStructure, CreateFeeStructureInput, UpdateFeeStructureInput } from '../model/fee.types';

export const feesApi = {
  list: async () => {
    const response = await apiClient.get<FeeRecord[]>('/fees');
    console.log('Fetched fees:', response.data);
    return response.data;
  },
  pay: async (id: number, payload: FeePaymentInput) => {
    const response = await apiClient.put<FeeRecord>(`/fees/${id}/pay`, payload);
    return response.data;
  },
};

export const feeStructuresApi = {
  list: async () => {
    const response = await apiClient.get<FeeStructure[]>('/fee-structures');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<FeeStructure>(`/fee-structures/${id}`);
    return response.data;
  },
  getByClass: async (classId: number) => {
    const response = await apiClient.get<FeeStructure[]>(`/fee-structures/class/${classId}`);
    return response.data;
  },
  create: async (payload: CreateFeeStructureInput) => {
    const response = await apiClient.post<FeeStructure>('/fee-structures', payload);
    return response.data;
  },
  update: async (id: number, payload: UpdateFeeStructureInput) => {
    const response = await apiClient.put<FeeStructure>(`/fee-structures/${id}`, payload);
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`/fee-structures/${id}`);
  },
};
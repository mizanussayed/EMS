import { apiClient } from '@/services/http/apiClient';
import type { FeePaymentInput, FeeRecord } from '../model/fee.types';

export const feesApi = {
  list: async () => {
    const response = await apiClient.get<FeeRecord[]>('/fees');
    return response.data;
  },
  pay: async (id: number, payload: FeePaymentInput) => {
    const response = await apiClient.put<FeeRecord>(`/fees/${id}/pay`, payload);
    return response.data;
  },
};
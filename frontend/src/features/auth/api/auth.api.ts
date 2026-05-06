import { apiClient } from '@/services/http/apiClient';
import type { AuthResponse, LoginCredentials } from '../model/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};
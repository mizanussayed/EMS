import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { LoginCredentials } from '../model/auth.types';
import { useAuthStore } from '../model/auth.store';

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (session) => {
      setSession(session);
    },
  });
}
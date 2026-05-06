import { useCallback } from 'react';
import { useLoginMutation } from './useLoginMutation';
import { useAuthStore } from '../model/auth.store';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const loginMutation = useLoginMutation();

  const login = useCallback(
    async (userName: string, password: string) => {
      await loginMutation.mutateAsync({ userName, password });
    },
    [loginMutation]
  );

  return {
    auth: session,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error instanceof Error ? loginMutation.error.message : null,
    login,
    logout: clearSession,
  };
}
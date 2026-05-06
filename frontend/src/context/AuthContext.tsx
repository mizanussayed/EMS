import type { ReactNode } from 'react';

export interface AuthState {
  accessToken: string;
  refreshToken?: string | null;
  role: string;
  userName: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return children;
}
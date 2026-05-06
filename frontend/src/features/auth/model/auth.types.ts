export interface AuthSession {
  accessToken: string;
  refreshToken?: string | null;
  role: string;
  userName: string;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export type AuthResponse = AuthSession;
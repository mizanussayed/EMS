import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  role: string;
  userName: string;
}

interface AuthContextType {
  auth: AuthState | null;
  loginLoading: boolean;
  loginError: string | null;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const login = useCallback(async (userName: string, password: string) => {
    setLoginError(null);
    setLoginLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        setLoginError('Invalid username or password.');
        return;
      }

      const data = (await response.json()) as AuthState;
      setAuth(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loginLoading, loginError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

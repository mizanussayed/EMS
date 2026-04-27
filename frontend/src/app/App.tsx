import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  role: string;
  userName: string;
}

interface LoginCredentials {
  userName: string;
  password: string;
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(
    () => {
      const storedAuth = localStorage.getItem('auth');
      return storedAuth ? JSON.parse(storedAuth) : null;
    }
  );

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = useCallback(async ({ userName, password }: LoginCredentials) => {
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

  const handleLogout = useCallback(() => {
    setAuth(null);
  }, []);

  return (
    <Router>
      <AppRoutes
        auth={auth}
        handleLogin={handleLogin}
        loginLoading={loginLoading}
        loginError={loginError}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

import { useCallback, useState } from 'react';
import LoginPage from './components/LoginPage';
import MainLayout from './components/MainLayout';
import TeacherDashboard from './components/TeacherDashboard';
import StudentMobileDashboard from './components/StudentMobileDashboard';

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
  const [auth, setAuth] = useState<AuthState | null>(null);
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

      console.log('Login response status:', response.status);
      console.log('Login response body:', response);
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

  if (!auth) {
    return <LoginPage onLogin={handleLogin} loading={loginLoading} errorMessage={loginError} />;
  }

  if (auth.role === 'admin') {
      return <MainLayout auth={auth} onLogout={handleLogout} />;
  }
  else if (auth.role === 'teacher') {
    return <TeacherDashboard onNavigate={() => {}} />;
  }
  else if (auth.role === 'student') {
    return <StudentMobileDashboard onNavigate={() => {}} />;
  }else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h1 className="text-gray-900 mb-4">Unknown Role</h1>
          <p className="text-gray-600">Your account has an unrecognized role. Please contact support.</p>
          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}

import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Attendance from './components/pages/Attendance';
import Classes from './components/pages/Classes';
import Dashboard from './components/pages/Dashboard';
import Events from './components/pages/Events';
import Exams from './components/pages/Exams';
import Fees from './components/pages/Fees';
import Library from './components/pages/Library';
import Reports from './components/pages/Reports';
import Results from './components/pages/Results';
import Settings from './components/pages/Settings';
import Students from './components/pages/Students';
import Subjects from './components/pages/Subjects';
import Teachers from './components/pages/Teachers';
import Timetable from './components/pages/Timetable';
import StudentMobileDashboard from './components/StudentMobileDashboard';
import TeacherDashboard from './components/TeacherDashboard';

interface AuthState {
  accessToken: string;
  refreshToken: string;
  role: string;
  userName: string;
}

interface AppRoutesProps {
  auth: AuthState | null;
  handleLogin: (credentials: { userName: string; password: string }) => void;
  loginLoading: boolean;
  loginError: string | null;
  handleLogout: () => void;
}

export default function AppRoutes({
  auth,
  handleLogin,
  loginLoading,
  loginError,
  handleLogout,
}: AppRoutesProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth || location.pathname !== '/') {
      return;
    }

    const roleHome: Record<string, string> = {
      admin: '/dashboard',
      teacher: '/teacher',
      student: '/student',
    };

    const target = roleHome[auth.role] || '/dashboard';
    navigate(target, { replace: true });
  }, [auth, location.pathname, navigate]);

  const handleNavigate = (page: string) => {
    if (!page) {
      return;
    }

    const target = page.startsWith('/') ? page : `/${page}`;
    navigate(target);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage onLogin={handleLogin} loading={loginLoading} errorMessage={loginError} />}
      />

      <Route element={<ProtectedRoute auth={auth} allowedRoles={['admin']} />}>
        <Route element={auth ? <MainLayout auth={auth} onLogout={handleLogout} /> : null}>
          <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
          <Route path="/students" element={auth ? <Students token={auth.accessToken} /> : null} />
          <Route path="/teachers" element={auth ? <Teachers token={auth.accessToken} /> : null} />
          <Route path="/classes" element={auth ? <Classes token={auth.accessToken} /> : null} />
          <Route path="/subjects" element={auth ? <Subjects token={auth.accessToken} /> : null} />
          <Route path="/attendance" element={auth ? <Attendance token={auth.accessToken} /> : null} />
          <Route path="/exams" element={auth ? <Exams token={auth.accessToken} /> : null} />
          <Route path="/results" element={auth ? <Results token={auth.accessToken} /> : null} />
          <Route path="/timetable" element={auth ? <Timetable token={auth.accessToken} /> : null} />
          <Route path="/fees" element={auth ? <Fees token={auth.accessToken} /> : null} />
          <Route path="/library" element={auth ? <Library token={auth.accessToken} /> : null} />
          <Route path="/events" element={auth ? <Events token={auth.accessToken} /> : null} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute auth={auth} allowedRoles={['teacher']} />}>
        <Route path="/teacher" element={<TeacherDashboard onNavigate={() => {}} />} />
      </Route>

      <Route element={<ProtectedRoute auth={auth} allowedRoles={['student']} />}>
        <Route path="/student" element={<StudentMobileDashboard onNavigate={() => {}} />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <h1 className="text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600">The page you are looking for does not exist.</p>
              <button
                onClick={() => (window.location.href = '/')}
                className="mt-6 px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Go to Home
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

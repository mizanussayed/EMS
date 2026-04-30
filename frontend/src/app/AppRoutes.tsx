import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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

export default function AppRoutes() {
  const { auth, login, loginLoading, loginError } = useAuth();
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

  const handleLogin = (credentials: { userName: string; password: string }) => {
    login(credentials.userName, credentials.password);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage onLogin={handleLogin} loading={loginLoading} errorMessage={loginError} />}
      />

      <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher']} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/results" element={<Results />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/library" element={<Library />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/teacher" element={<TeacherDashboard onNavigate={() => {}} />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<StudentMobileDashboard onNavigate={() => {}} />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <h1 className="text-gray-900 mb-4 font-black">Page Not Found</h1>
              <p className="text-gray-600 font-medium">The page you are looking for does not exist.</p>
              <button
                onClick={() => (window.location.href = '/')}
                className="mt-6 px-8 py-3 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all shadow-lg shadow-[#2D6CDF]/20"
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

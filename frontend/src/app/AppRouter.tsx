import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import AuthGuard from '@/app/guards/AuthGuard';
import GuestGuard from '@/app/guards/GuestGuard';
import MainLayout from '@/app/components/MainLayout';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const TeacherDashboard = lazy(() => import('@/features/teacher-dashboard/pages/TeacherDashboardPage'));
const Attendance = lazy(() => import('@/features/attendance/pages/AttendancePage'));
const Classes = lazy(() => import('@/features/classes/pages/ClassesPage'));
const Shifts = lazy(() => import('@/features/shifts/pages/ShiftsPage'));
const Badges = lazy(() => import('@/features/badges/pages/BadgesPage'));
const Events = lazy(() => import('@/features/events/pages/EventsPage'));
const Exams = lazy(() => import('@/features/exams/pages/ExamsPage'));
const Fees = lazy(() => import('@/features/fees/pages/FeesPage'));
const Library = lazy(() => import('@/features/library/pages/LibraryPage'));
const Reports = lazy(() => import('@/features/reports/pages/ReportsPage'));
const Results = lazy(() => import('@/features/results/pages/ResultsPage'));
const Settings = lazy(() => import('@/features/settings/pages/SettingsPage'));
const Students = lazy(() => import('@/features/students/pages/StudentsPage'));
const StudentDetail = lazy(() => import('@/features/students/pages/StudentDetailPage'));
const Subjects = lazy(() => import('@/features/subjects/pages/SubjectsPage'));
const Teachers = lazy(() => import('@/features/teachers/pages/TeachersPage'));
const Timetable = lazy(() => import('@/features/timetable/pages/TimetablePage'));

function RouteFallback() {
  return <div className="p-8 text-sm text-white bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] min-h-screen">Loading...</div>;
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
        <h1 className="text-gray-900 mb-4 font-black">Page Not Found</h1>
        <p className="text-gray-600 font-medium">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<GuestGuard />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route element={<AuthGuard allowedRoles={['admin', 'teacher']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/shifts" element={<Shifts />} />
              <Route path="/badges" element={<Badges />} />
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

          <Route element={<AuthGuard allowedRoles={['teacher']} />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
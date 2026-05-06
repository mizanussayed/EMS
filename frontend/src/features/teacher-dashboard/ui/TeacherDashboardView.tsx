import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Users,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useTeacherDashboardSummary,
  useTeacherEvents,
  useTeacherExams,
  useTeacherTimetable,
} from '../hooks/useTeacherDashboard';

const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
const todayLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date());

export default function TeacherDashboardView() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const summaryQuery = useTeacherDashboardSummary();
  const timetableQuery = useTeacherTimetable();
  const examsQuery = useTeacherExams();
  const eventsQuery = useTeacherEvents();

  const loading = summaryQuery.isLoading || timetableQuery.isLoading || examsQuery.isLoading || eventsQuery.isLoading;
  const errorMessage = summaryQuery.error ?? timetableQuery.error ?? examsQuery.error ?? eventsQuery.error;

  const goTo = (screen: string) => {
    if (screen === 'login') {
      logout();
      navigate('/', { replace: true });
      return;
    }

    navigate(screen.startsWith('/') ? screen : `/${screen}`);
  };

  const todaySchedule = useMemo(
    () =>
      (timetableQuery.data ?? [])
        .filter((item) => item.dayOfWeek.toLowerCase() === todayName.toLowerCase())
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [timetableQuery.data]
  );

  const upcomingExams = useMemo(
    () =>
      (examsQuery.data ?? [])
        .filter((exam) => new Date(exam.startDate) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 4),
    [examsQuery.data]
  );

  const upcomingEvents = useMemo(
    () =>
      (eventsQuery.data ?? [])
        .filter((event) => new Date(event.startDate) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 4),
    [eventsQuery.data]
  );

  const summary = summaryQuery.data;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => goTo('login')} className="p-2 hover:bg-gray-100 rounded-lg" title="Sign out">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Teacher Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {auth?.userName ?? 'Teacher'}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">{todayName}</p>
            <p className="text-sm text-gray-600">{todayLabel}</p>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage instanceof Error ? errorMessage.message : 'Unable to load teacher dashboard.'}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : summary?.classCount ?? 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#2D6CDF]" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : summary?.studentCount ?? 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Attendance Today</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : summary?.attendanceCount ?? 0}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Today's Schedule</h2>
                <Clock className="w-5 h-5 text-[#2D6CDF]" />
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Loading schedule...</p>
              ) : todaySchedule.length === 0 ? (
                <p className="text-sm text-gray-500">No classes scheduled for today.</p>
              ) : (
                <div className="space-y-4">
                  {todaySchedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 border-l-4 border-[#2D6CDF] bg-blue-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-[#2D6CDF] rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{item.subjectName}</p>
                        <p className="text-sm text-gray-600">{item.className}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-[#2D6CDF]">{item.startTime} - {item.endTime}</span>
                          <span className="text-sm text-gray-600">{item.room}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => goTo('attendance')}
                        className="px-4 py-2 bg-white text-[#2D6CDF] border border-[#2D6CDF] rounded-lg hover:bg-[#2D6CDF] hover:text-white transition-all text-sm"
                      >
                        Mark Attendance
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Mark Attendance', icon: CheckSquare, route: 'attendance' },
                  { label: 'Students', icon: Users, route: 'students' },
                  { label: 'Results', icon: FileText, route: 'results' },
                  { label: 'Timetable', icon: Calendar, route: 'timetable' },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.route}
                      onClick={() => goTo(link.route)}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2D6CDF] hover:bg-blue-50 transition-all"
                    >
                      <div className="w-10 h-10 bg-[#2D6CDF] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-900 text-sm">{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Upcoming Exams
              </h2>
              {loading ? (
                <p className="text-sm text-gray-500">Loading exams...</p>
              ) : upcomingExams.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming exams found.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{exam.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exam.className || 'All classes'} - {new Date(exam.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                School Events
              </h2>
              {loading ? (
                <p className="text-sm text-gray-500">Loading events...</p>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming events found.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.type} - {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

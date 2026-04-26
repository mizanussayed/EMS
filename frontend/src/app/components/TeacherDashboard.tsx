import { ArrowLeft, Clock, BookOpen, FileText, CheckSquare, Upload, BarChart3 } from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const todaySchedule = [
    { time: '08:00 - 09:00', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 201' },
    { time: '09:15 - 10:15', subject: 'Mathematics', class: 'Grade 10-B', room: 'Room 201' },
    { time: '10:30 - 11:30', subject: 'Algebra', class: 'Grade 11-A', room: 'Room 203' },
    { time: '12:00 - 01:00', subject: 'Statistics', class: 'Grade 12-A', room: 'Room 205' },
  ];

  const quickLinks = [
    { label: 'Mark Attendance', icon: CheckSquare, action: () => onNavigate('attendance') },
    { label: 'View Assignments', icon: FileText, action: () => {} },
    { label: 'Gradebook', icon: BarChart3, action: () => onNavigate('exam-results') },
    { label: 'Upload Materials', icon: Upload, action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('login')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Teacher Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, Prof. Michael Anderson</p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">Wednesday</p>
            <p className="text-sm text-gray-600">November 26, 2025</p>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Today's Schedule</h2>
                <Clock className="w-5 h-5 text-[#2D6CDF]" />
              </div>

              <div className="space-y-4">
                {todaySchedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-l-4 border-[#2D6CDF] bg-blue-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#2D6CDF] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{item.subject}</p>
                      <p className="text-sm text-gray-600">{item.class}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-[#2D6CDF]">{item.time}</span>
                        <span className="text-sm text-gray-600">{item.room}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-[#2D6CDF] border border-[#2D6CDF] rounded-lg hover:bg-[#2D6CDF] hover:text-white transition-all text-sm">
                      Start Class
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={index}
                      onClick={link.action}
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

          {/* Assignments Overview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">Assignments Overview</h2>

              <div className="space-y-4">
                {/* Pending */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">Pending Review</p>
                    <span className="text-orange-600">24</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Assignments waiting for review
                  </div>
                  <button className="mt-3 w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all">
                    Review Now
                  </button>
                </div>

                {/* Submitted */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">Submitted</p>
                    <span className="text-green-600">156</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Assignments graded this week
                  </div>
                  <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                    View All
                  </button>
                </div>

                {/* Late */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">Late Submissions</p>
                    <span className="text-red-600">8</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Assignments submitted after deadline
                  </div>
                  <button className="mt-3 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                    Check Late
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { text: 'New assignment submitted by Sarah J.', time: '5 min ago' },
                  { text: 'Attendance marked for Grade 10-A', time: '1 hour ago' },
                  { text: 'New message from Admin', time: '2 hours ago' },
                  { text: 'Grade updated for Math test', time: '3 hours ago' },
                ].map((activity, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

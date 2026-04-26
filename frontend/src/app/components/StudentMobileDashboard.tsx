import {
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  ClipboardList,
  MessageSquare,
  Clock,
  UserCircle,
  Bell,
} from 'lucide-react';

interface StudentMobileDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function StudentMobileDashboard({ onNavigate }: StudentMobileDashboardProps) {
  const menuItems = [
    { id: 'courses', label: 'My Courses', icon: BookOpen, color: 'bg-blue-500', action: () => {} },
    { id: 'assignments', label: 'Assignments', icon: FileText, color: 'bg-green-500', action: () => {} },
    { id: 'attendance', label: 'Attendance', icon: Calendar, color: 'bg-purple-500', action: () => {} },
    { id: 'fees', label: 'Fees', icon: DollarSign, color: 'bg-orange-500', action: () => {} },
    { id: 'exams', label: 'Exams', icon: ClipboardList, color: 'bg-red-500', action: () => onNavigate('exam-results') },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'bg-pink-500', action: () => {} },
    { id: 'timetable', label: 'Timetable', icon: Clock, color: 'bg-teal-500', action: () => {} },
  ];

  const upcomingClasses = [
    { subject: 'Mathematics', time: '09:00 AM', room: 'Room 201', teacher: 'Prof. Anderson' },
    { subject: 'Science', time: '11:00 AM', room: 'Room 105', teacher: 'Prof. Smith' },
    { subject: 'English', time: '02:00 PM', room: 'Room 303', teacher: 'Prof. Johnson' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D6CDF] to-[#1a4ba8] text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-[#2D6CDF]" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Welcome back,</p>
              <h1 className="text-white">Sarah Johnson</h1>
            </div>
          </div>
          <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-blue-100">Attendance</p>
            <p className="text-white">94.2%</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-blue-100">Grade</p>
            <p className="text-white">A+</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-blue-100">Rank</p>
            <p className="text-white">3/45</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Quick Access Grid */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all active:scale-95"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-900 text-sm">{item.label}</p>
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('student-profile')}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-3">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-900 text-sm">My Profile</p>
            </button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Today's Classes</h2>
            <p className="text-sm text-gray-500">Wednesday, Nov 26</p>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((classItem, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-[#2D6CDF]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900 mb-1">{classItem.subject}</p>
                    <p className="text-sm text-gray-600">{classItem.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#2D6CDF]">{classItem.time}</p>
                    <p className="text-sm text-gray-600">{classItem.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div>
          <h2 className="text-gray-900 mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Math Assignment</p>
                  <p className="text-sm text-gray-600">Due: Tomorrow</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Urgent</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Science Project</p>
                  <p className="text-sm text-gray-600">Due: Dec 5, 2025</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Upcoming</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Fee Payment</p>
                  <p className="text-sm text-gray-600">All fees paid</p>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center py-3 px-6">
          <button className="flex flex-col items-center gap-1 text-[#2D6CDF]">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Bell className="w-6 h-6" />
            <span className="text-xs">Alerts</span>
          </button>
          <button
            onClick={() => onNavigate('student-profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <UserCircle className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

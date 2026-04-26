import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Search,
  Bell,
  UserCircle,
  Plus,
  FileBarChart,
  ClipboardList,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: UserCheck },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'exams', label: 'Exams', icon: FileText },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const kpiData = [
    { title: 'Total Students', value: '2,456', change: '+12%', color: 'bg-blue-500' },
    { title: 'Total Teachers', value: '156', change: '+5%', color: 'bg-green-500' },
    { title: 'Attendance %', value: '94.2%', change: '+2.1%', color: 'bg-purple-500' },
    { title: 'Fee Collection', value: '$125K', change: '+18%', color: 'bg-orange-500' },
  ];

  const quickActions = [
    { label: 'Add Student', icon: Plus, action: () => onNavigate('student-profile') },
    { label: 'Create Timetable', icon: Calendar, action: () => {} },
    { label: 'Generate Report', icon: FileBarChart, action: () => {} },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#2D6CDF] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">EMS Admin</h2>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeMenu === item.id
                      ? 'bg-[#2D6CDF] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, teachers, courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <UserCircle className="w-10 h-10 text-gray-400" />
                <div className="hidden sm:block">
                  <p className="text-gray-900">Admin User</p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <span className="text-green-600 text-sm">{kpi.change}</span>
                </div>
                <h3 className="text-gray-600 mb-1">{kpi.title}</h3>
                <p className="text-gray-900">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2D6CDF] hover:bg-blue-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-[#2D6CDF] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-900">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">Recent Students</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#2D6CDF]" />
                      </div>
                      <div>
                        <p className="text-gray-900">Student Name {i}</p>
                        <p className="text-sm text-gray-500">Grade 10 - Roll #{1000 + i}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('student-profile')}
                      className="text-[#2D6CDF] hover:underline text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {[
                  { title: 'Parent-Teacher Meeting', date: 'Dec 5, 2025' },
                  { title: 'Annual Sports Day', date: 'Dec 10, 2025' },
                  { title: 'Mid-Term Exams', date: 'Dec 15, 2025' },
                  { title: 'Winter Break', date: 'Dec 20, 2025' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

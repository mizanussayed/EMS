import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [summary, setSummary] = useState<{
    studentCount: number;
    classCount: number;
    attendanceCount: number;
    presentCount: number;
    absentCount: number;
    date: string;
  } | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/dashboard`);
        if (!response.ok) {
          throw new Error('Unable to load dashboard summary.');
        }
        const data = await response.json();
        if (active) {
          setSummary(data);
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : 'Unable to load dashboard summary.';
          setSummaryError(message);
        }
      }
    };

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  const attendanceRate = useMemo(() => {
    if (!summary || summary.attendanceCount === 0) {
      return '0%';
    }
    return `${((summary.presentCount / summary.attendanceCount) * 100).toFixed(1)}%`;
  }, [summary]);

  const kpiCards = [
    {
      title: 'Total Students',
      value: summary ? summary.studentCount.toLocaleString() : '--',
      change: summary ? `Today: ${summary.date}` : 'Loading',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Teachers',
      value: '87',
      change: 'Static',
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      title: 'Total Classes',
      value: summary ? summary.classCount.toLocaleString() : '--',
      change: summary ? `${summary.attendanceCount} attendance records` : 'Loading',
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Attendance Rate',
      value: summary ? attendanceRate : '--',
      change: summary ? `${summary.presentCount} present` : 'Loading',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    { action: 'New student enrolled', user: 'John Smith - Grade 10A', time: '10 minutes ago', icon: Users },
    { action: 'Exam results published', user: 'Mid-term Mathematics', time: '1 hour ago', icon: Award },
    { action: 'Fee payment received', user: 'Sarah Johnson - Grade 9B', time: '2 hours ago', icon: DollarSign },
    { action: 'Event scheduled', user: 'Annual Sports Day - Dec 15', time: '3 hours ago', icon: Calendar },
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Dec 1, 2025', time: '10:00 AM', type: 'Meeting' },
    { title: 'Final Exams Begin', date: 'Dec 5, 2025', time: '9:00 AM', type: 'Exam' },
    { title: 'Winter Holiday Starts', date: 'Dec 20, 2025', time: 'All Day', type: 'Holiday' },
  ];

  const classPerformance = [
    { class: 'Grade 10A', students: 35, avgScore: 87, attendance: 96 },
    { class: 'Grade 10B', students: 32, avgScore: 82, attendance: 94 },
    { class: 'Grade 9A', students: 38, avgScore: 89, attendance: 95 },
    { class: 'Grade 9B', students: 34, avgScore: 85, attendance: 93 },
  ];

  const notices = [
    { title: 'Library Closure', message: 'Library will be closed on Dec 1st for maintenance', priority: 'high' },
    { title: 'Sports Equipment', message: 'New sports equipment available in the gym', priority: 'low' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your school today.</p>
        {summaryError && (
          <p className="mt-2 text-sm text-red-600">{summaryError}</p>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-gray-600 mb-1">{kpi.title}</h3>
              <p className="text-gray-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('students')}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-all"
          >
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Enroll Student</span>
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-all"
          >
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Mark Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('exams')}
            className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-all"
          >
            <Award className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Schedule Exam</span>
          </button>
          <button
            onClick={() => onNavigate('fees')}
            className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-all"
          >
            <DollarSign className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Collect Fees</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#2D6CDF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-gray-900">{event.title}</p>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{event.type}</span>
                </div>
                <p className="text-sm text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {event.date} • {event.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Performance */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Class Performance Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Class</th>
                <th className="px-6 py-3 text-center text-gray-700">Students</th>
                <th className="px-6 py-3 text-center text-gray-700">Avg Score</th>
                <th className="px-6 py-3 text-center text-gray-700">Attendance</th>
                <th className="px-6 py-3 text-center text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classPerformance.map((cls, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{cls.class}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{cls.students}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{cls.avgScore}%</td>
                  <td className="px-6 py-4 text-center text-gray-900">{cls.attendance}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2D6CDF]"
                          style={{ width: `${cls.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Notices */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-gray-900 mb-4">Important Notices</h2>
        <div className="space-y-3">
          {notices.map((notice, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                notice.priority === 'high'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 ${
                    notice.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                  }`}
                />
                <div>
                  <p className="text-gray-900 mb-1">{notice.title}</p>
                  <p className="text-sm text-gray-600">{notice.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

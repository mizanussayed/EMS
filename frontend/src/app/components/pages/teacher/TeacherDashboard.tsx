import { Users, Calendar, BookOpen, ClipboardCheck, Award, Bell } from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const teacherInfo = {
    name: 'Dr. Robert Williams',
    subject: 'Mathematics',
    classes: ['Grade 10A', 'Grade 10B', 'Grade 9A'],
    totalStudents: 87,
  };

  const todayClasses = [
    { time: '08:00 AM - 09:00 AM', class: 'Grade 10A', subject: 'Algebra', room: 'Room 201' },
    { time: '10:00 AM - 11:00 AM', class: 'Grade 10B', subject: 'Geometry', room: 'Room 203' },
    { time: '02:00 PM - 03:00 PM', class: 'Grade 9A', subject: 'Basic Math', room: 'Room 105' },
  ];

  const recentAnnouncements = [
    { title: 'Staff Meeting Tomorrow', date: '2025-12-03', type: 'Important' },
    { title: 'Grade Submission Deadline', date: '2025-12-05', type: 'Reminder' },
    { title: 'Parent-Teacher Conference', date: '2025-12-10', type: 'Event' },
  ];

  const upcomingExams = [
    { class: 'Grade 10A', subject: 'Mathematics', date: '2025-12-08', type: 'Mid-Term' },
    { class: 'Grade 10B', subject: 'Mathematics', date: '2025-12-09', type: 'Mid-Term' },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Welcome back, {teacherInfo.name}!</h1>
        <p className="text-gray-600">{teacherInfo.subject} Teacher</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition" onClick={() => onNavigate('my-classes')}>
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{teacherInfo.classes.length}</span>
          </div>
          <p className="text-blue-100 text-sm">My Classes</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition" onClick={() => onNavigate('my-students')}>
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{teacherInfo.totalStudents}</span>
          </div>
          <p className="text-green-100 text-sm">Total Students</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition" onClick={() => onNavigate('attendance')}>
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">3</span>
          </div>
          <p className="text-orange-100 text-sm">Classes Today</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition" onClick={() => onNavigate('results')}>
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">2</span>
          </div>
          <p className="text-purple-100 text-sm">Pending Exams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Today's Schedule
            </h2>
            <button 
              onClick={() => onNavigate('timetable')}
              className="text-sm text-[#2D6CDF] hover:underline"
            >
              View Full Timetable
            </button>
          </div>

          <div className="space-y-4">
            {todayClasses.map((cls, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-shrink-0 w-24 text-sm text-gray-600">
                  {cls.time}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900">{cls.class} - {cls.subject}</h3>
                  <p className="text-sm text-gray-500">{cls.room}</p>
                </div>
                <button 
                  onClick={() => onNavigate('attendance')}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                >
                  Mark Attendance
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Announcements
          </h2>

          <div className="space-y-4">
            {recentAnnouncements.map((announcement, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm text-gray-900">{announcement.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    announcement.type === 'Important' ? 'bg-red-100 text-red-700' :
                    announcement.type === 'Reminder' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {announcement.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Upcoming Exams
          </h2>
          <button 
            onClick={() => onNavigate('exams')}
            className="text-sm text-[#2D6CDF] hover:underline"
          >
            View All Exams
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Class</th>
                <th className="px-6 py-3 text-left text-gray-700">Subject</th>
                <th className="px-6 py-3 text-left text-gray-700">Exam Type</th>
                <th className="px-6 py-3 text-left text-gray-700">Date</th>
                <th className="px-6 py-3 text-center text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingExams.map((exam, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{exam.class}</td>
                  <td className="px-6 py-4 text-gray-900">{exam.subject}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {exam.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{exam.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onNavigate('results')}
                      className="px-3 py-1 bg-[#2D6CDF] text-white rounded-lg text-sm hover:bg-[#1a4ba8] transition"
                    >
                      Enter Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => onNavigate('attendance')}
          className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
        >
          <ClipboardCheck className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="text-gray-900 mb-1">Mark Attendance</h3>
          <p className="text-sm text-gray-500">Record student attendance</p>
        </button>
        
        <button 
          onClick={() => onNavigate('results')}
          className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
        >
          <Award className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="text-gray-900 mb-1">Enter Grades</h3>
          <p className="text-sm text-gray-500">Submit exam results</p>
        </button>
        
        <button 
          onClick={() => onNavigate('timetable')}
          className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
        >
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="text-gray-900 mb-1">View Timetable</h3>
          <p className="text-sm text-gray-500">Check class schedule</p>
        </button>
        
        <button 
          onClick={() => onNavigate('my-students')}
          className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
        >
          <Users className="w-8 h-8 text-orange-600 mb-2" />
          <h3 className="text-gray-900 mb-1">My Students</h3>
          <p className="text-sm text-gray-500">View student list</p>
        </button>
      </div>
    </div>
  );
}

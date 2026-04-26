import { Users, Clock, BookOpen, Calendar } from 'lucide-react';

export default function MyClasses() {
  const classes = [
    {
      name: 'Grade 10A',
      subject: 'Mathematics',
      students: 32,
      schedule: 'Mon, Wed, Fri - 08:00 AM',
      room: 'Room 201',
      attendance: '94%',
      nextClass: 'Tomorrow, 08:00 AM',
    },
    {
      name: 'Grade 10B',
      subject: 'Mathematics',
      students: 28,
      schedule: 'Tue, Thu - 10:00 AM',
      room: 'Room 203',
      attendance: '92%',
      nextClass: 'Today, 10:00 AM',
    },
    {
      name: 'Grade 9A',
      subject: 'Mathematics',
      students: 27,
      schedule: 'Mon, Wed, Fri - 02:00 PM',
      room: 'Room 105',
      attendance: '96%',
      nextClass: 'Today, 02:00 PM',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">My Classes</h1>
        <p className="text-gray-600">Manage your assigned classes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Classes</p>
          <p className="text-gray-900 mt-1">{classes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-blue-600 mt-1">{classes.reduce((sum, c) => sum + c.students, 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Average Attendance</p>
          <p className="text-green-600 mt-1">94%</p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.map((cls, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-gray-900 mb-1">{cls.name}</h2>
                <p className="text-gray-600">{cls.subject}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-gray-900">{cls.students}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="text-gray-900">{cls.room}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Schedule</p>
              </div>
              <p className="text-gray-900 text-sm ml-6">{cls.schedule}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-green-600">{cls.attendance}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Class</p>
                <p className="text-gray-900 text-sm">{cls.nextClass}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] transition text-sm">
                Mark Attendance
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Attendance marked for Grade 10A</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Exam results published for Grade 10B</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Assignment submitted by Grade 9A students</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, Calendar, Save, CheckCircle2 } from 'lucide-react';

interface AttendancePageProps {
  onNavigate: (screen: string) => void;
}

interface Student {
  id: number;
  rollNo: string;
  name: string;
  status: 'present' | 'absent' | 'late';
}

export default function AttendancePage({ onNavigate }: AttendancePageProps) {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, rollNo: '1001', name: 'Alice Williams', status: 'present' },
    { id: 2, rollNo: '1002', name: 'Bob Smith', status: 'present' },
    { id: 3, rollNo: '1003', name: 'Charlie Brown', status: 'present' },
    { id: 4, rollNo: '1004', name: 'Diana Prince', status: 'present' },
    { id: 5, rollNo: '1005', name: 'Ethan Hunt', status: 'present' },
    { id: 6, rollNo: '1006', name: 'Fiona Green', status: 'present' },
    { id: 7, rollNo: '1007', name: 'George Miller', status: 'present' },
    { id: 8, rollNo: '1008', name: 'Hannah Davis', status: 'present' },
    { id: 9, rollNo: '1009', name: 'Ian Carter', status: 'present' },
    { id: 10, rollNo: '1010', name: 'Julia Roberts', status: 'present' },
  ]);

  const [saved, setSaved] = useState(false);

  const updateStatus = (id: number, status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const markAll = (status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(s => ({ ...s, status })));
    setSaved(false);
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('teacher')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Mark Attendance</h1>
            <p className="text-sm text-gray-600">Grade 10-A • Mathematics</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>November 26, 2025</span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-gray-600 mb-1">Present</p>
            <p className="text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <p className="text-gray-600 mb-1">Absent</p>
            <p className="text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
            <p className="text-gray-600 mb-1">Late</p>
            <p className="text-orange-600">{stats.late}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-gray-700">Quick Mark:</p>
            <div className="flex gap-3">
              <button
                onClick={() => markAll('present')}
                className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-all"
              >
                All Present
              </button>
              <button
                onClick={() => markAll('absent')}
                className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
              >
                All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">Roll No</th>
                  <th className="px-6 py-4 text-left text-gray-700">Student Name</th>
                  <th className="px-6 py-4 text-center text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4 text-gray-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => updateStatus(student.id, 'present')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            student.status === 'present'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => updateStatus(student.id, 'absent')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            student.status === 'absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => updateStatus(student.id, 'late')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            student.status === 'late'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-3">
            {students.map((student) => (
              <div key={student.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">Roll: {student.rollNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateStatus(student.id, 'present')}
                    className={`py-2 rounded-lg transition-all text-sm ${
                      student.status === 'present'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => updateStatus(student.id, 'absent')}
                    className={`py-2 rounded-lg transition-all text-sm ${
                      student.status === 'absent'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => updateStatus(student.id, 'late')}
                    className={`py-2 rounded-lg transition-all text-sm ${
                      student.status === 'late'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Late
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`px-8 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[#2D6CDF] text-white hover:bg-[#1a4ba8]'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Attendance Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Attendance
              </>
            )}
          </button>
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700">
              Attendance has been successfully saved for Grade 10-A Mathematics on November 26, 2025
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

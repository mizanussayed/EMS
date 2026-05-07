import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Download, Clock, Search, Info } from 'lucide-react';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { useAttendanceByClass, useAttendanceStudents } from '../hooks/useAttendance';
import type { AttendanceRecord, AttendanceStatus } from '../model/attendance.types';

export default function AttendanceView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const studentsQuery = useAttendanceStudents();
  const attendanceQuery = useAttendanceByClass(selectedClass, selectedDate, Boolean(selectedClass));

  const students = studentsQuery.data ?? [];

  const classOptions = useMemo(() => {
    const classSet = new Set(
      students.map((student) => student.className).filter((value): value is string => Boolean(value))
    );
    return Array.from(classSet).sort();
  }, [students]);

  useEffect(() => {
    if (!selectedClass && classOptions.length > 0) {
      setSelectedClass(classOptions[0]);
    }
  }, [classOptions, selectedClass]);

  useEffect(() => {
    if (!selectedClass || !attendanceQuery.data) {
      return;
    }

    const attendanceByStudent = new Map<number, { studentId: number; status: string }>();
    attendanceQuery.data.forEach((record) => {
      attendanceByStudent.set(record.studentId, record);
    });

    const records: AttendanceRecord[] = students
      .filter((student) => (student.className ?? 'Unassigned') === selectedClass)
      .map((student) => {
        const existing = attendanceByStudent.get(student.id);
        const fullName = `${student.firstName} ${student.lastName}`.trim();
        return {
          studentId: student.id,
          rollNo: student.admissionNumber ?? `STU-${student.id}`,
          name: fullName,
          status: (existing?.status as AttendanceStatus) || 'Present',
        };
      });

    setAttendanceData(records);
  }, [attendanceQuery.data, selectedClass, students]);

  const filteredData = attendanceData.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter((record) => record.status === 'Present').length,
    absent: attendanceData.filter((record) => record.status === 'Absent').length,
    late: attendanceData.filter((record) => record.status === 'Late').length,
    excused: attendanceData.filter((record) => record.status === 'Excused').length,
  };

  const attendanceRate = stats.total ? ((stats.present / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <RoleGuard allowedRoles={['admin', 'teacher']}>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-gray-900 font-bold text-3xl mb-1">Attendance Tracking</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">View attendance data (auto-synced from device)</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold shadow-sm">
              <Download className="w-5 h-5 text-[#2D6CDF]" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: Search },
            { label: 'Present', value: stats.present, icon: CheckCircle },
            { label: 'Absent', value: stats.absent, icon: XCircle },
            { label: 'Late/Excused', value: stats.late + stats.excused, icon: Clock },
            { label: 'Rate', value: `${attendanceRate}%`, icon: Info },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-gray-900 text-2xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2D6CDF]" />
                Filters
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-medium"
                  >
                    {classOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-medium"
                  />
                </div>
                <div className="pt-4 border-t border-gray-100 bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-700 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Read-Only Mode
                  </p>
                  <p className="text-blue-600 text-xs leading-relaxed">Attendance data is automatically synced from your attendance device. Manual edits are not permitted.</p>
                </div>
              </div>
            </div>
            {attendanceQuery.error && (
              <div className="p-4 rounded-2xl border bg-red-50 border-red-100 text-red-700">
                <p className="text-sm font-bold">{attendanceQuery.error instanceof Error ? attendanceQuery.error.message : 'Unable to load attendance data.'}</p>
              </div>
            )}
          </div>

          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {attendanceQuery.isLoading ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-gray-500 font-medium">Loading attendance...</td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-gray-500 font-medium">No attendance records found.</td>
                      </tr>
                    ) : (
                      filteredData.map((record) => (
                        <tr key={record.studentId} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div>
                              <p className="text-gray-900 font-bold group-hover:text-[#2D6CDF] transition-colors">{record.name}</p>
                              <p className="text-gray-400 text-xs font-medium">{record.rollNo}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-1">
                              {[
                                { id: 'Present', color: 'green', icon: CheckCircle },
                                { id: 'Absent', color: 'red', icon: XCircle },
                                { id: 'Late', color: 'orange', icon: Clock },
                                { id: 'Excused', color: 'blue', icon: Info },
                              ].map((btn) => (
                                <div
                                  key={btn.id}
                                  className={`p-2 rounded-lg transition-all flex flex-col items-center gap-0.5 min-w-[60px] opacity-40 cursor-not-allowed ${
                                    record.status === btn.id
                                      ? `bg-${btn.color}-600 text-white opacity-100`
                                      : 'bg-gray-50 text-gray-400'
                                  }`}
                                  title="Read-only mode - data from device"
                                >
                                  <btn.icon className="w-4 h-4" />
                                  <span className="text-[10px] font-bold uppercase">{btn.id}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              record.status === 'Present' ? 'bg-green-100 text-green-700' :
                              record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

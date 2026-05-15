import { useEffect, useMemo, useState } from 'react';
import { Calendar, Download, Info } from 'lucide-react';
import { RoleGuard } from '@/app/guards/RoleGuard';
import SectionHeader from '@/components/SectionHeader';
import FilterBar from '@/components/FilterBar';
import StatSummaryCard from '@/components/StatSummaryCard';
import StatusBadge from '@/components/StatusBadge';
import { useAttendanceByClass, useAttendanceStudents } from '../hooks/useAttendance';
import type { AttendanceRecord, AttendanceStatus } from '../model/attendance.types';

export default function AttendanceView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
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

  const attendanceData = useMemo<AttendanceRecord[]>(() => {
    if (!selectedClass || !attendanceQuery.data) {
      return [];
    }

    const attendanceByStudent = new Map<number, (typeof attendanceQuery.data)[number]>();
    attendanceQuery.data.forEach((record) => {
      attendanceByStudent.set(record.studentId, record);
    });

    return students
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
  }, [attendanceQuery.data, selectedClass, students]);

  const filteredData = useMemo(
    () =>
      attendanceData.filter(
        (record) =>
          record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [attendanceData, searchTerm]
  );

  const stats = useMemo(
    () => ({
      total: attendanceData.length,
      present: attendanceData.filter((record) => record.status === 'Present').length,
      absent: attendanceData.filter((record) => record.status === 'Absent').length,
      late: attendanceData.filter((record) => record.status === 'Late').length,
      excused: attendanceData.filter((record) => record.status === 'Excused').length,
    }),
    [attendanceData]
  );

  const attendanceRate = useMemo(
    () => (stats.total ? ((stats.present / stats.total) * 100).toFixed(1) : '0.0'),
    [stats.present, stats.total]
  );

  const getAttendanceVariant = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Absent':
        return 'error';
      case 'Late':
        return 'warning';
      case 'Excused':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleExportCsv = () => {
    const escapeCsv = (value: string | number | undefined) => {
      const text = String(value ?? '');
      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const csv = [
      ['Roll No', 'Name', 'Status'],
      ...filteredData.map((record) => [record.rollNo, record.name, record.status]),
    ].map((row) => row.map(escapeCsv).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `attendance-${selectedClass}-${selectedDate}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <RoleGuard allowedRoles={['admin', 'teacher']}>
      <div className="p-6 max-w-[1600px] mx-auto">
        <SectionHeader
          icon={Calendar}
          title="Attendance Tracking"
          subtitle="View attendance data auto-synced from the device"
          action={{ label: 'Export', onClick: handleExportCsv, icon: Download }}
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Present', value: stats.present, color: 'text-green-600' },
            { label: 'Absent', value: stats.absent, color: 'text-red-600' },
            { label: 'Late/Excused', value: stats.late + stats.excused, color: 'text-orange-600' },
            { label: 'Rate', value: `${attendanceRate}%`, color: 'text-blue-600' },
          ].map((stat, index) => (
            <StatSummaryCard key={index} label={stat.label} value={stat.value} color={stat.color} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <SectionHeader
                icon={Calendar}
                title="Filters"
                subtitle="Attendance is read-only and synced from the device"
                className="mb-6"
              />
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
              <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search students..."
                className="rounded-none border-0 border-b border-gray-100 shadow-none p-6 bg-gray-50/30"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {attendanceQuery.isLoading ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-10 text-center text-gray-500 font-medium">Loading attendance...</td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-10 text-center text-gray-500 font-medium">No attendance records found.</td>
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
                            <div className="flex justify-center">
                              <StatusBadge
                                status={record.status}
                                variant={getAttendanceVariant(record.status)}
                              />
                            </div>
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

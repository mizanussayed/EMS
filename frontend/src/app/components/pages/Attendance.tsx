import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Download, Clock } from 'lucide-react';

interface AttendanceRecord {
  studentId: number;
  rollNo: string;
  name: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

interface ApiStudent {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
}

interface ApiAttendance {
  id: number;
  studentId: number;
  studentName: string;
  className?: string;
  date: string;
  status: string;
  notes?: string;
}

interface AttendanceProps {
  token?: string;
}

export default function Attendance({ token }: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const classOptions = useMemo(() => {
    const classSet = new Set(
      students
        .map((student) => student.className)
        .filter((value): value is string => Boolean(value))
    );
    return Array.from(classSet);
  }, [students]);

  useEffect(() => {
    let active = true;

    const loadStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Unable to load students.');
        }
        const data = (await response.json()) as ApiStudent[];
        if (active) {
          setStudents(data);
          if (data.length > 0 && !selectedClass) {
            const defaultClass = data.find((student) => student.className)?.className;
            if (defaultClass) {
              setSelectedClass(defaultClass);
            }
          }
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : 'Unable to load students.';
          setSaveError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      return;
    }

    let active = true;

    const loadAttendance = async () => {
      setLoading(true);
      setSaveError(null);
      try {
        const response = await fetch(`/api/attendance/${encodeURIComponent(selectedClass)}`);
        if (!response.ok) {
          throw new Error('Unable to load attendance.');
        }
        const data = (await response.json()) as ApiAttendance[];
        if (!active) {
          return;
        }

        const attendanceByStudent = new Map<number, ApiAttendance>();
        data
          .filter((record) => record.date === selectedDate)
          .forEach((record) => {
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
              status: (existing?.status as AttendanceRecord['status']) ?? 'Present',
            };
          });

        setAttendanceData(records);
        setHasChanges(false);
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : 'Unable to load attendance.';
          setSaveError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      active = false;
    };
  }, [selectedClass, selectedDate, students]);

  const updateAttendance = (studentId: number, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
    setHasChanges(true);
  };

  const saveAttendance = async () => {
    if (!token) {
      setSaveError('Please sign in before saving attendance.');
      return;
    }
    if (attendanceData.length === 0) {
      return;
    }

    setSaveError(null);
    setSaveSuccess(null);

    const results = await Promise.allSettled(
      attendanceData.map(async (record) => {
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: record.studentId,
            date: selectedDate,
            status: record.status,
            notes: '',
          }),
        });

        if (!response.ok) {
          throw new Error('Unable to save attendance.');
        }
      })
    );

    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      setSaveError('Some attendance records could not be saved.');
      return;
    }

    setSaveSuccess(`Attendance saved for ${selectedClass} on ${selectedDate}.`);
    setHasChanges(false);
  };

  const markAllPresent = () => {
    setAttendanceData(prev => prev.map(record => ({ ...record, status: 'Present' as const })));
    setHasChanges(true);
  };

  const markAllAbsent = () => {
    setAttendanceData(prev => prev.map(record => ({ ...record, status: 'Absent' as const })));
    setHasChanges(true);
  };

  const presentCount = attendanceData.filter((s) => s.status === 'Present').length;
  const absentCount = attendanceData.filter((s) => s.status === 'Absent').length;
  const lateCount = attendanceData.filter((s) => s.status === 'Late').length;
  const excusedCount = attendanceData.filter((s) => s.status === 'Excused').length;
  const attendanceRate = attendanceData.length
    ? ((presentCount / attendanceData.length) * 100).toFixed(1)
    : '0.0';

  // Weekly trend data (mock)
  const weeklyTrend = [
    { day: 'Mon', percentage: 95 },
    { day: 'Tue', percentage: 92 },
    { day: 'Wed', percentage: 94 },
    { day: 'Thu', percentage: 91 },
    { day: 'Fri', percentage: 93 },
    { day: 'Sat', percentage: 89 },
    { day: 'Sun', percentage: 0 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Mark and track student attendance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-gray-900 mt-1">{attendanceData.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Present</p>
          <p className="text-green-600 mt-1">{presentCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Absent</p>
          <p className="text-red-600 mt-1">{absentCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Late / Excused</p>
          <p className="text-yellow-600 mt-1">{lateCount + excusedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Attendance Rate</p>
          <p className="text-orange-600 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setHasChanges(false);
                  setSaveError(null);
                  setSaveSuccess(null);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setHasChanges(false);
                setSaveError(null);
                setSaveSuccess(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              {classOptions.length === 0 && <option value="">No classes found</option>}
              {classOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={markAllPresent}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Mark All Present
            </button>
          </div>
          <div className="flex items-end">
            <button 
              onClick={markAllAbsent}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Mark All Absent
            </button>
          </div>
        </div>
        
        {saveError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {saveSuccess}
          </div>
        )}
        {hasChanges && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-yellow-800">You have unsaved changes</span>
            <button
              onClick={saveAttendance}
              className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] text-sm"
            >
              Save Attendance
            </button>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-gray-900">Mark Attendance - {selectedClass} ({selectedDate})</h2>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Roll No</th>
                <th className="px-6 py-4 text-left text-gray-700">Student Name</th>
                <th className="px-6 py-4 text-center text-gray-700">Mark Attendance</th>
                <th className="px-6 py-4 text-center text-gray-700">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{student.rollNo}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.studentId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => updateAttendance(student.studentId, 'Present')}
                        className={`px-3 py-2 rounded-lg flex items-center gap-1 transition text-sm ${
                          student.status === 'Present'
                            ? 'bg-green-500 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Present
                      </button>
                      <button 
                        onClick={() => updateAttendance(student.studentId, 'Absent')}
                        className={`px-3 py-2 rounded-lg flex items-center gap-1 transition text-sm ${
                          student.status === 'Absent'
                            ? 'bg-red-500 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Absent
                      </button>
                      <button 
                        onClick={() => updateAttendance(student.studentId, 'Late')}
                        className={`px-3 py-2 rounded-lg flex items-center gap-1 transition text-sm ${
                          student.status === 'Late'
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Late
                      </button>
                      <button 
                        onClick={() => updateAttendance(student.studentId, 'Excused')}
                        className={`px-3 py-2 rounded-lg transition text-sm ${
                          student.status === 'Excused'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      student.status === 'Present' ? 'bg-green-100 text-green-700' :
                      student.status === 'Absent' ? 'bg-red-100 text-red-700' :
                      student.status === 'Late' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="text-center py-6 text-gray-500">Loading attendance...</div>
        )}
        {!loading && attendanceData.length === 0 && (
          <div className="text-center py-6 text-gray-500">No students found for this class.</div>
        )}
      </div>

      {/* Weekly Attendance Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-gray-900 mb-4">Weekly Attendance Trend</h2>
        <div className="grid grid-cols-7 gap-2">
          {weeklyTrend.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-600 mb-2">{day.day}</p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-center p-2">
                {day.percentage > 0 && (
                  <div 
                    className="w-full bg-[#2D6CDF] rounded transition-all hover:bg-[#1a4ba8]" 
                    style={{ height: `${day.percentage}%` }}
                    title={`${day.percentage}%`}
                  ></div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{day.percentage > 0 ? `${day.percentage}%` : 'Holiday'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

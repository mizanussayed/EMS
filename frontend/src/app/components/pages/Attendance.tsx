import { useEffect, useMemo, useState, useCallback } from 'react';
import { Calendar, CheckCircle, XCircle, Download, Clock, Search, Save, Info } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { RoleGuard } from '../auth/RoleGuard';

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

export default function Attendance() {
  const api = useApi();
  const { auth } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const classOptions = useMemo(() => {
    const classSet = new Set(
      students
        .map((student) => student.className)
        .filter((value): value is string => Boolean(value))
    );
    return Array.from(classSet).sort();
  }, [students]);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/students');
      setStudents(data);
      if (data.length > 0 && !selectedClass) {
        const defaultClass = data.find((student: any) => student.className)?.className;
        if (defaultClass) setSelectedClass(defaultClass);
      }
    } catch (error: any) {
      setSaveError(error.message);
    } finally {
      setLoading(false);
    }
  }, [api, selectedClass]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const loadAttendance = useCallback(async () => {
    if (!selectedClass) return;
    setLoading(true);
    setSaveError(null);
    try {
      const data = await api.get(`/attendance/${encodeURIComponent(selectedClass)}`);

      const attendanceByStudent = new Map<number, ApiAttendance>();
      data
        .filter((record: any) => record.date === selectedDate)
        .forEach((record: any) => {
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
            status: (existing?.status as AttendanceRecord['status']) || 'Present',
          };
        });

      setAttendanceData(records);
      setHasChanges(false);
    } catch (error: any) {
      setSaveError(error.message);
    } finally {
      setLoading(false);
    }
  }, [api, selectedClass, selectedDate, students]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const updateAttendance = (studentId: number, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
    setHasChanges(true);
  };

  const saveAttendance = async () => {
    setLoading(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      // Loop through records and save them individually (as per original logic)
      // Ideally this should be a bulk POST endpoint
      await Promise.all(attendanceData.map(record => 
        api.post('/attendance', {
          studentId: record.studentId,
          date: selectedDate,
          status: record.status,
          notes: '',
        })
      ));

      setSaveSuccess(`Attendance saved successfully for ${selectedClass}.`);
      setHasChanges(false);
    } catch (error: any) {
      setSaveError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAll = (status: 'Present' | 'Absent') => {
    setAttendanceData(prev => prev.map(record => ({ ...record, status })));
    setHasChanges(true);
  };

  const filteredData = attendanceData.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(r => r.status === 'Present').length,
    absent: attendanceData.filter(r => r.status === 'Absent').length,
    late: attendanceData.filter(r => r.status === 'Late').length,
    excused: attendanceData.filter(r => r.status === 'Excused').length,
  };

  const attendanceRate = stats.total ? ((stats.present / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <RoleGuard allowedRoles={['admin', 'teacher']}>
      <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-bold text-3xl mb-1">Attendance Tracking</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Monitor daily student presence</p>
        </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold shadow-sm">
              <Download className="w-5 h-5 text-[#2D6CDF]" />
              Export
            </button>
            {(auth?.role === 'admin' || auth?.role === 'teacher') && (
              <button 
                onClick={saveAttendance}
                disabled={!hasChanges || loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
                  hasChanges 
                    ? 'bg-[#2D6CDF] text-white shadow-[#2D6CDF]/20 hover:bg-[#1a4ba8]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            )}
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'blue', icon: Search },
          { label: 'Present', value: stats.present, color: 'green', icon: CheckCircle },
          { label: 'Absent', value: stats.absent, color: 'red', icon: XCircle },
          { label: 'Late/Excused', value: stats.late + stats.excused, color: 'orange', icon: Clock },
          { label: 'Rate', value: `${attendanceRate}%`, color: 'purple', icon: Info },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-medium"
                >
                  {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-medium"
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase mb-3">Bulk Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => markAll('Present')} className="py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors">All Present</button>
                  <button onClick={() => markAll('Absent')} className="py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">All Absent</button>
                </div>
              </div>
            </div>
          </div>
          {(saveError || saveSuccess) && (
            <div className={`p-4 rounded-2xl border ${saveError ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
              <p className="text-sm font-bold">{saveError || saveSuccess}</p>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  {filteredData.map((record) => (
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
                            <button
                              key={btn.id}
                              onClick={() => updateAttendance(record.studentId, btn.id as any)}
                              className={`p-2 rounded-lg transition-all flex flex-col items-center gap-0.5 min-w-[60px] ${
                                record.status === btn.id 
                                  ? `bg-${btn.color}-600 text-white shadow-lg shadow-${btn.color}-600/20 scale-105`
                                  : `bg-gray-50 text-gray-400 hover:bg-${btn.color}-50 hover:text-${btn.color}-600`
                              }`}
                            >
                              <btn.icon className="w-4 h-4" />
                              <span className="text-[10px] font-bold uppercase">{btn.id}</span>
                            </button>
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
                  ))}
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

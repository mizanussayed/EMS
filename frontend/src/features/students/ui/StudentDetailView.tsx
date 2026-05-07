import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, User, Phone, Calendar, BookOpen, CheckCircle, XCircle, Clock, FileText, CreditCard, StickyNote, FolderOpen, IdCard, ChevronRight, AlertCircle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
  section?: string;
  gender?: string;
  dateOfBirth?: string;
  active: boolean;
  phone?: string;
  email?: string;
  address?: string;
  parent?: string;
  parentPhone?: string;
}

interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

type Tab = 'details' | 'attendance' | 'notes' | 'idcard' | 'documents';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { Present: 'bg-green-50 text-green-600 border border-green-100', Absent: 'bg-red-50 text-red-600 border border-red-100', Late: 'bg-orange-50 text-orange-600 border border-orange-100', Excused: 'bg-blue-50 text-blue-600 border border-blue-100' };
  return <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${map[status] ?? 'bg-gray-50 text-gray-500'}`}>{status}</span>;
}

export default function StudentDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { auth } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/students/${id}`);
      setStudent(data);
    } catch {
      navigate('/students', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [api, id, navigate]);

  const fetchAttendance = useCallback(async () => {
    if (!student?.className) return;
    setAttendanceLoading(true);
    try {
      const data = await api.get(`/attendance/${encodeURIComponent(student.className)}`);
      const filtered = (data as any[]).filter((record: any) => {
        const date = new Date(record.date);
        return record.studentId === student.id && date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      });
      setAttendance(filtered.map((record: any) => ({ date: record.date, status: record.status })));
    } catch {
      setAttendance([]);
    } finally {
      setAttendanceLoading(false);
    }
  }, [api, student, selectedMonth, selectedYear]);

  useEffect(() => { fetchStudent(); }, [fetchStudent]);
  useEffect(() => { if (activeTab === 'attendance') fetchAttendance(); }, [activeTab, fetchAttendance]);

  if (loading) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><div className="flex flex-col items-center gap-4"><div className="w-12 h-12 border-4 border-[#2D6CDF] border-t-transparent rounded-full animate-spin" /><p className="text-gray-500 font-medium">Loading student profile...</p></div></div>;
  }

  if (!student) return null;

  const fullName = `${student.firstName} ${student.lastName}`.trim();
  const initials = student.firstName.charAt(0) + (student.lastName?.charAt(0) ?? '');
  const presentCount = attendance.filter((record) => record.status === 'Present').length;
  const absentCount = attendance.filter((record) => record.status === 'Absent').length;
  const lateCount = attendance.filter((record) => record.status === 'Late').length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'details', label: 'Details', icon: User },
    { key: 'attendance', label: 'Attendance', icon: Calendar },
    { key: 'notes', label: 'Notes', icon: StickyNote },
    { key: 'idcard', label: 'ID Card', icon: IdCard },
    { key: 'documents', label: 'Documents', icon: FolderOpen },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-[#2D6CDF] transition-colors font-medium">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/students" className="hover:text-[#2D6CDF] transition-colors font-medium">Students</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-bold">{fullName}</span>
        </div>
        <div className="flex gap-3">
          {auth?.role === 'admin' && <button onClick={() => navigate('/students')} className="flex items-center gap-2 px-5 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all shadow-lg shadow-[#2D6CDF]/20 active:scale-95"><Edit className="w-4 h-4" />Edit Student</button>}
          <button onClick={() => navigate('/students')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"><ArrowLeft className="w-4 h-4" />Back to List</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-[#2D6CDF] to-[#7B5EA7]" />
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-3 min-w-[140px]">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#2D6CDF] to-[#7B5EA7] flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-[#2D6CDF]/20 select-none">{initials}</div>
              <div className="text-center">
                <p className="font-black text-gray-900 text-lg leading-tight">{fullName}</p>
                <p className="text-gray-400 text-sm font-medium">ID: {student.id}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>{student.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
              {[
                { label: 'Roll Number', value: student.admissionNumber ?? `STU-${student.id}`, highlight: true },
                { label: "Father's Name", value: student.parent ?? '—' },
                { label: 'Class', value: student.className ?? '—', badge: 'blue' },
                { label: "Mother's Name", value: '—' },
                { label: 'Section', value: student.section ?? '—', badge: 'purple' },
                { label: 'Date of Birth', value: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—' },
                { label: 'Gender', value: student.gender ?? '—' },
                { label: 'Contact', value: student.phone ?? '—' },
                { label: 'Email', value: student.email ?? 'N/A' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 py-2 border-b border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                  {item.badge === 'blue' ? <span className="inline-flex w-fit px-3 py-0.5 bg-blue-500 text-white text-xs font-black rounded-lg mt-0.5">{item.value}</span> : item.badge === 'purple' ? <span className="inline-flex w-fit px-3 py-0.5 bg-purple-500 text-white text-xs font-black rounded-lg mt-0.5">{item.value}</span> : <span className={`font-bold text-sm ${item.highlight ? 'text-[#2D6CDF]' : 'text-gray-900'}`}>{item.value}</span>}
                </div>
              ))}
              <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-0.5 py-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</span>
                <span className="font-bold text-sm text-gray-900">{student.address ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#2D6CDF] to-[#7B5EA7] p-1">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === key ? 'bg-white text-gray-900 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'details' && <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><Section title="Personal Information" icon={User}><InfoRow label="Full Name" value={fullName} /><InfoRow label="Gender" value={student.gender ?? '—'} /><InfoRow label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'} /><InfoRow label="Admission No" value={student.admissionNumber ?? '—'} /></Section><Section title="Contact Details" icon={Phone}><InfoRow label="Phone" value={student.phone ?? '—'} /><InfoRow label="Email" value={student.email ?? '—'} /><InfoRow label="Address" value={student.address ?? '—'} /></Section><Section title="Academic Info" icon={BookOpen}><InfoRow label="Class" value={student.className ?? '—'} /><InfoRow label="Section" value={student.section ?? '—'} /><InfoRow label="Status" value={student.active ? 'Active' : 'Inactive'} /></Section><Section title="Parent / Guardian" icon={User}><InfoRow label="Parent Name" value={student.parent ?? '—'} /><InfoRow label="Parent Phone" value={student.parentPhone ?? '—'} /></Section></div>}

          {activeTab === 'attendance' && <div className="space-y-6"><div className="flex flex-wrap gap-2">{MONTHS.map((month, index) => (<button key={month} onClick={() => setSelectedMonth(index)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedMonth === index ? 'bg-[#2D6CDF] text-white shadow-lg shadow-[#2D6CDF]/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'}`}>{month}</button>))}</div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[{ label: 'Present', value: presentCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' }, { label: 'Absent', value: absentCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' }, { label: 'Late', value: lateCount, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }, { label: 'Rate', value: `${attendanceRate}%`, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' }].map(({ label, value, icon: Icon, color, bg, border }) => (<div key={label} className={`${bg} ${border} border rounded-2xl p-5 flex flex-col gap-2`}><div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${color} shadow-sm`}><Icon className="w-5 h-5" /></div><p className={`text-2xl font-black ${color}`}>{value}</p><p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p></div>))}</div><div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">{attendanceLoading ? <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-[#2D6CDF] border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400 font-medium text-sm">Loading attendance...</p></div> : attendance.length === 0 ? <div className="py-16 text-center"><Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 font-bold">No attendance records for {MONTHS[selectedMonth]} {selectedYear}</p></div> : <table className="w-full text-left"><thead className="bg-white border-b border-gray-100"><tr><th className="px-6 py-3 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th><th className="px-6 py-3 text-[10px] font-black uppercase text-gray-400 tracking-widest">Day</th><th className="px-6 py-3 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th></tr></thead><tbody className="divide-y divide-gray-50">{attendance.map((record, index) => { const date = new Date(record.date); return <tr key={index} className="hover:bg-white transition-colors"><td className="px-6 py-3 font-bold text-gray-900 text-sm">{date.toLocaleDateString()}</td><td className="px-6 py-3 text-gray-500 font-medium text-sm">{date.toLocaleDateString('en-US', { weekday: 'long' })}</td><td className="px-6 py-3"><StatusBadge status={record.status} /></td></tr>; })}</tbody></table>}</div></div>}

          {activeTab === 'notes' && <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="text-gray-900 font-black text-lg">Student Notes</h3><button className="px-5 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold text-sm hover:bg-[#1a4ba8] transition-all shadow-lg shadow-[#2D6CDF]/20 active:scale-95">Save Note</button></div><textarea rows={8} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add notes about this student — behaviour, academic observations, health notes, etc." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all resize-none" /><div className="p-6 bg-yellow-50 border border-yellow-100 rounded-2xl"><div className="flex items-start gap-3"><StickyNote className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" /><div><p className="text-yellow-800 font-bold text-sm">Notes are private</p><p className="text-yellow-700 text-xs mt-0.5 font-medium">Notes are only visible to staff and administrators. They will not appear on student-facing views.</p></div></div></div></div>}

          {activeTab === 'idcard' && <div className="space-y-6"><div className="flex items-center justify-between"><h3 className="text-gray-900 font-black text-lg">Student ID Card</h3><button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-xl active:scale-95"><FileText className="w-4 h-4" />Print ID Card</button></div><div className="flex justify-center"><div className="w-80 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-100"><div className="bg-gradient-to-r from-[#2D6CDF] to-[#7B5EA7] p-5 text-center text-white"><p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">School Management System</p><p className="text-lg font-black">Student ID Card</p></div><div className="bg-white p-6"><div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2D6CDF] to-[#7B5EA7] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#2D6CDF]/20 flex-shrink-0">{initials}</div><div><p className="font-black text-gray-900 text-lg leading-tight">{fullName}</p><p className="text-gray-400 text-xs font-bold mt-0.5">Student</p></div></div><div className="space-y-2.5">{[{ label: 'ID', value: `#${String(student.id).padStart(4, '0')}` }, { label: 'Class', value: student.className ?? '—' }, { label: 'Section', value: student.section ?? '—' }, { label: 'Roll No', value: student.admissionNumber ?? `STU-${student.id}` }].map(({ label, value }) => <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span><span className="font-bold text-gray-900 text-sm">{value}</span></div>)}</div></div><div className="bg-gradient-to-r from-[#2D6CDF] to-[#7B5EA7] p-3"><div className="flex justify-between">{Array.from({ length: 20 }).map((_, index) => <div key={index} className="w-1.5 h-6 bg-white/20 rounded-full" />)}</div></div></div></div></div>}

          {activeTab === 'documents' && <div className="space-y-6"><div className="flex items-center justify-between"><h3 className="text-gray-900 font-black text-lg">Documents</h3>{auth?.role === 'admin' && <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold text-sm hover:bg-[#1a4ba8] transition-all shadow-lg shadow-[#2D6CDF]/20 active:scale-95"><FolderOpen className="w-4 h-4" />Upload Document</button>}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[{ label: 'Birth Certificate', icon: CreditCard, status: 'Missing' }, { label: 'Previous Transcripts', icon: FileText, status: 'Missing' }, { label: 'Medical Records', icon: FileText, status: 'Missing' }].map(({ label, icon: Icon, status }) => <div key={label} className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#2D6CDF]/30 hover:bg-blue-50/20 transition-all cursor-pointer group"><div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-3 group-hover:border-[#2D6CDF]/20 transition-all shadow-sm"><Icon className="w-6 h-6 text-gray-300 group-hover:text-[#2D6CDF] transition-colors" /></div><p className="font-bold text-gray-700 text-sm mb-1">{label}</p><p className="text-[10px] font-black text-red-400 uppercase tracking-widest">{status}</p></div>)} </div><div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200"><FolderOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" /><p className="text-gray-400 font-bold">No documents uploaded yet</p><p className="text-gray-300 text-sm font-medium mt-1">Upload student documents for record keeping</p></div></div>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof User; children: React.ReactNode }) {
  return <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6"><div className="flex items-center gap-2.5 mb-5"><div className="w-8 h-8 rounded-xl bg-[#2D6CDF]/10 flex items-center justify-center"><Icon className="w-4 h-4 text-[#2D6CDF]" /></div><h3 className="font-black text-gray-900">{title}</h3></div><div className="space-y-3">{children}</div></div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0"><span className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span><span className="text-sm font-bold text-gray-900 text-right max-w-[60%]">{value}</span></div>;
}

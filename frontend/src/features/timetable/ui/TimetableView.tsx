import { useState, useEffect, useCallback } from 'react';
import { Clock, Edit, User, MapPin, Plus, Trash2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import Modal from '@/components/ui/Modal';
import GenericForm, { type FormField } from '@/components/ui/GenericForm';
import { useAuth } from '@/context/AuthContext';
import { useToast, useConfirm } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface TimetableEntry {
  id: number;
  className: string;
  subjectName: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

interface Student {
  id: number;
  className?: string;
  firstName: string;
  lastName: string;
}

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const getTimetableFormFields = (): FormField[] => [
  { name: 'subjectName', label: 'Subject Name', type: 'text', placeholder: 'e.g. Advanced Calculus', required: true },
  { name: 'teacherName', label: 'Teacher Name', type: 'text', placeholder: 'e.g. Prof. Hawking', required: true },
  { name: 'dayOfWeek', label: 'Day of Week', type: 'select', options: days.map((day) => ({ label: day, value: day })), required: true },
  { name: 'room', label: 'Room / Lab', type: 'text', placeholder: 'e.g. Science Lab 02', required: true },
  { name: 'startTime', label: 'Start Time', type: 'select', options: timeSlots.map((time) => ({ label: time, value: time })), required: true },
  { name: 'endTime', label: 'End Time', type: 'select', options: timeSlots.map((time) => ({ label: time, value: time })), required: true },
];

export default function TimetableView() {
  const api = useApi();
  const { auth } = useAuth();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [selectedClass, setSelectedClass] = useState('');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await api.get('/students');
      const classSet = new Set<string>();
      data.forEach((student: Student) => {
        if (student.className) classSet.add(student.className);
      });
      const classArray = Array.from(classSet).sort();
      setClasses(classArray);
      if (classArray.length > 0 && !selectedClass) {
        setSelectedClass(classArray[0]);
      }
    } catch (err: any) {
      error(err.message);
    }
  }, [api, selectedClass, error]);

  const fetchTimetable = useCallback(async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const data = await api.get(`/timetable/${encodeURIComponent(selectedClass)}`);
      setEntries(data || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, selectedClass]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);
  useEffect(() => { fetchTimetable(); }, [fetchTimetable]);

  const handleSubmit = async (data: any) => {
    try {
      const payload = { ...data, className: selectedClass };
      if (modalMode === 'add') {
        await api.post('/timetable', payload);
        success('Timetable entry added successfully.');
      } else if (selectedEntry) {
        await api.put(`/timetable/${selectedEntry.id}`, payload);
        success('Timetable entry updated successfully.');
      }
      await fetchTimetable();
      setShowModal(false);
      setSelectedEntry(null);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm('This timetable entry will be permanently removed.', 'Delete Entry?');
    if (!ok) return;
    try {
      await api.delete(`/timetable/${id}`);
      await fetchTimetable();
      success('Timetable entry deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleEditClick = (entry: TimetableEntry) => { setSelectedEntry(entry); setModalMode('edit'); setShowModal(true); };
  const handleAddClick = () => { setModalMode('add'); setSelectedEntry(null); setShowModal(true); };
  const getEntryForSlot = (day: string, time: string) => entries.find((entry) => entry.dayOfWeek === day && entry.startTime === time);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-1">Class Timetable</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Academic Schedule Planner</p>
        </div>
        <div className="flex gap-3">
          {classes.length > 0 && (
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-bold text-gray-700 shadow-sm">
              <option value="">Select Class</option>
              {classes.map((className) => <option key={className} value={className}>{className}</option>)}
            </select>
          )}
          {auth?.role === 'admin' && selectedClass && (
            <button onClick={handleAddClick} className="px-6 py-3 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-black shadow-xl shadow-[#2D6CDF]/20 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              Add Entry
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest border-r border-gray-100 w-32">Time</th>
                {days.map((day) => <th key={day} className="p-6 text-xs font-black uppercase text-gray-700 tracking-widest text-center">{day}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map((time, index) => (
                <tr key={index} className="group">
                  <td className="p-8 text-center border-r border-gray-100 bg-gray-50/20">
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-[#2D6CDF] mb-1" />
                      <span className="text-gray-900 font-black text-sm">{time}</span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const entry = getEntryForSlot(day, time);
                    return (
                      <td key={day} className="p-3 align-top min-w-[200px]">
                        {entry ? (
                          <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 hover:bg-blue-50 hover:shadow-lg transition-all group/card relative cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 bg-white text-[#2D6CDF] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">{entry.subjectName}</span>
                              {auth?.role === 'admin' && (
                                <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <button onClick={() => handleEditClick(entry)} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors text-[#2D6CDF]" title="Edit"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              )}
                            </div>
                            <h4 className="text-gray-900 font-black mb-4">{entry.subjectName}</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider"><User className="w-3 h-3" />{entry.teacherName}</div>
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" />{entry.startTime} - {entry.endTime}</div>
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider"><MapPin className="w-3 h-3" />{entry.room}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 rounded-3xl border-2 border-dashed border-gray-50 flex items-center justify-center group-hover:border-blue-100 transition-colors">
                            <Plus className="w-6 h-6 text-gray-100 group-hover:text-blue-200 transition-colors" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'New Schedule Entry' : 'Edit Schedule Entry'}>
        <GenericForm fields={getTimetableFormFields()} initialData={selectedEntry || { dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:00' }} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitLabel={modalMode === 'add' ? 'Create Entry' : 'Update Entry'} />
      </Modal>

      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}

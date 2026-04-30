import { useState, useEffect, useCallback } from 'react';
import { Clock, Edit, User, MapPin, Plus } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Modal from '../ui/Modal';
import GenericForm, { FormField } from '../ui/GenericForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';

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

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const timetableFormFields: FormField[] = [
  { name: 'subjectName', label: 'Subject Name', type: 'text', placeholder: 'e.g. Advanced Calculus', required: true },
  { name: 'teacherName', label: 'Teacher Name', type: 'text', placeholder: 'e.g. Prof. Hawking', required: true },
  { name: 'dayOfWeek', label: 'Day of Week', type: 'select', options: days.map(d => ({label: d, value: d})), required: true },
  { name: 'room', label: 'Room / Lab', type: 'text', placeholder: 'e.g. Science Lab 02', required: true },
  { name: 'startTime', label: 'Start Time', type: 'select', options: timeSlots.map(t => ({label: t, value: t})), required: true },
];

export default function Timetable() {
  const api = useApi();
  const { auth } = useAuth();
  const { toasts, remove, success, error } = useToast();
  const [selectedClass, setSelectedClass] = useState('Grade 1');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTimetable = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/timetable/${encodeURIComponent(selectedClass)}`);
      setEntries(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, selectedClass]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/timetable', { ...data, className: selectedClass, endTime: data.startTime });
      await fetchTimetable();
      setShowModal(false);
      success('Timetable entry added successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const getEntryForSlot = (day: string, time: string) => {
    return entries.find(e => e.dayOfWeek === day && e.startTime === time);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-1">Class Timetable</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Academic Schedule Planner</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-bold text-gray-700 shadow-sm"
          >
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
          </select>
          {auth?.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-black shadow-xl shadow-[#2D6CDF]/20 transition-all active:scale-95"
            >
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
                {days.map(day => (
                  <th key={day} className="p-6 text-xs font-black uppercase text-gray-700 tracking-widest text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map((time, idx) => (
                <tr key={idx} className="group">
                  <td className="p-8 text-center border-r border-gray-100 bg-gray-50/20">
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-[#2D6CDF] mb-1" />
                      <span className="text-gray-900 font-black text-sm">{time}</span>
                    </div>
                  </td>
                  {days.map(day => {
                    const entry = getEntryForSlot(day, time);
                    return (
                      <td key={day} className="p-3 align-top min-w-[200px]">
                        {entry ? (
                          <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 hover:bg-blue-50 hover:shadow-lg transition-all group/card relative cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 bg-white text-[#2D6CDF] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                                {entry.subjectName}
                              </span>
                              {auth?.role === 'admin' && (
                                <Edit className="w-4 h-4 text-gray-300 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                              )}
                            </div>
                            <h4 className="text-gray-900 font-black mb-4">{entry.subjectName}</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                                <User className="w-3 h-3" />
                                {entry.teacherName}
                              </div>
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                                <MapPin className="w-3 h-3" />
                                {entry.room}
                              </div>
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Schedule Entry"
      >
        <GenericForm
          fields={timetableFormFields}
          initialData={{ dayOfWeek: 'Monday', startTime: '08:00' }}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel="Create Entry"
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}

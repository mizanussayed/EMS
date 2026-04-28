import { useState, useEffect, useCallback } from 'react';
import { Clock, Edit, X, Calendar, MapPin, User, ChevronLeft, ChevronRight, Plus, Save, Search } from 'lucide-react';

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

interface TimetableProps {
  token: string;
}

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Timetable({ token }: TimetableProps) {
  const [selectedClass, setSelectedClass] = useState('Grade 1');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    className: '',
    subjectName: '',
    teacherName: '',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:00',
    room: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchTimetable = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/timetable/${encodeURIComponent(selectedClass)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch timetable');
      const data = await response.json();
      setEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, selectedClass]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const handleAddEntry = async () => {
    try {
      const response = await fetch(`${apiUrl}/timetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, className: selectedClass })
      });
      if (!response.ok) throw new Error('Failed to save entry');
      await fetchTimetable();
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getEntryForSlot = (day: string, time: string) => {
    return entries.find(e => e.dayOfWeek === day && e.startTime === time);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-2">Class Timetable</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Academic Schedule Planner</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black text-gray-700 shadow-sm"
          >
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#2D6CDF] text-white rounded-2xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-black shadow-xl shadow-[#2D6CDF]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
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
                          <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/5 transition-all group/card relative cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 bg-white text-[#2D6CDF] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                                {entry.subjectName}
                              </span>
                              <Edit className="w-4 h-4 text-gray-300 opacity-0 group-hover/card:opacity-100 transition-opacity" />
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-gray-900 font-black text-2xl">New Schedule Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={formData.subjectName}
                    onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                    placeholder="e.g. Advanced Calculus"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Teacher Name</label>
                  <input
                    type="text"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                    placeholder="e.g. Prof. Hawking"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Day of Week</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                  >
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Room / Lab</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    placeholder="e.g. Science Lab 02"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Start Time</label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                  >
                    {timeSlots.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-8 py-3 text-gray-500 font-bold hover:bg-white rounded-2xl transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleAddEntry}
                className="px-10 py-3 bg-[#2D6CDF] text-white rounded-2xl font-black hover:bg-[#1a4ba8] transition-all shadow-xl shadow-[#2D6CDF]/20 active:scale-95"
              >
                Create Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

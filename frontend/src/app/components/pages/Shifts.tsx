import { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast, useConfirm } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  studentLateTime?: string;
  teacherLateTime?: string;
  staffLateTime?: string;
  isActive: boolean;
}

export default function Shifts() {
  const api = useApi();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [data, setData] = useState<Shift[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Shift | null>(null);

  const [formData, setFormData] = useState<Partial<Shift>>({
    name: '',
    startTime: '',
    endTime: '',
    studentLateTime: '',
    teacherLateTime: '',
    staffLateTime: '',
    isActive: true
  });

  const fetchData = useCallback(async () => {
    try { setData(await api.get('/shifts')); } catch (err: any) { console.error(err); }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selected) await api.post('/shifts', formData);
      else await api.put(`/shifts/${selected.id}`, formData);
      await fetchData(); 
      success('Shift saved successfully.');
      resetForm();
    } catch (err: any) { error(err.message); }
  };

  const handleDelete = async (item: Shift) => {
    if (!await confirm('Delete this shift?')) return;
    try { await api.delete(`/shifts/${item.id}`); await fetchData(); success('Deleted.'); }
    catch (err: any) { error(err.message); }
  };

  const handleEdit = (item: Shift) => {
    setSelected(item);
    setFormData(item);
  };

  const resetForm = () => {
    setSelected(null);
    setFormData({
      name: '', startTime: '', endTime: '', studentLateTime: '', teacherLateTime: '', staffLateTime: '', isActive: true
    });
  };

  const filtered = data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-sm text-gray-500">Configure shifts and late times for students and staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="bg-[#2D6CDF] px-5 py-4 text-white font-bold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {selected ? 'Edit Shift' : 'Add New Shift'}
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Shift Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" placeholder="e.g. Day Shift" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Start Time</label>
              <div className="relative">
                <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">End Time</label>
              <div className="relative">
                <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-bold text-gray-700">Late Time Configuration</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Teacher Late Time</label>
                  <input type="time" value={formData.teacherLateTime} onChange={e => setFormData({...formData, teacherLateTime: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" />
                  <p className="text-[10px] text-gray-400 mt-1">Teachers arriving after this time will be marked as late</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Student Late Time</label>
                  <input type="time" value={formData.studentLateTime} onChange={e => setFormData({...formData, studentLateTime: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" />
                  <p className="text-[10px] text-gray-400 mt-1">Students arriving after this time will be marked as late</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Staff Late Time</label>
                  <input type="time" value={formData.staffLateTime} onChange={e => setFormData({...formData, staffLateTime: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" />
                  <p className="text-[10px] text-gray-400 mt-1">Staff arriving after this time will be marked as late</p>
                </div>
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-[#2D6CDF] border-gray-300 rounded focus:ring-[#2D6CDF]" />
                  <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">Active Shift</label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button type="submit" className="flex-1 bg-[#2D6CDF] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#1a4ba8] transition-all shadow-md shadow-[#2D6CDF]/20">
                {selected ? 'Update Shift' : 'Add Shift'}
              </button>
              {selected && (
                <button type="button" onClick={resetForm} className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Table Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#2D6CDF]/5 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[#2D6CDF] font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              All Shifts
            </h2>
            <input 
              type="text" 
              placeholder="Search shifts..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Start Time</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">End Time</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Student Late</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.startTime || '�'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.endTime || '�'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.studentLateTime || '�'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500 text-sm">
                      No shifts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}

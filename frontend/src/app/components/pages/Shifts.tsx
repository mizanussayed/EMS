import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast, useConfirm } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';
import GenericForm, {FormField} from '../ui/GenericForm';
import ConfirmDialog from '../ui/ConfirmDialog';

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


  const formFields: FormField[] = [
    { name: 'name', label: 'Shift Name', type: 'text', placeholder: 'Day Shift', required: true },
    { name: 'startTime', label: 'Start Time', type: 'time' },
    { name: 'endTime', label: 'End Time', type: 'time' },
    { name: 'teacherLateTime', label: 'Teacher Late Time', type: 'time' },
    { name: 'studentLateTime', label: 'Student Late Time', type: 'time' },
    { name: 'staffLateTime', label: 'Staff Late Time', type: 'time' },
    { name: 'isActive', label: 'Is Active', type: 'checkbox' },
  ];

  const fetchData = useCallback(async () => {
    try { setData(await api.get('/shifts')); } catch (err: any) { console.error(err); }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!selected) await api.post('/shifts', formData);
      else await api.put(`/shifts/${selected.id}`, formData);
      await fetchData();
      success('Shift saved successfully.');
      resetForm();
    } catch (err: any) { error(err.message); }
  };


  const handleDelete = async (item: Shift) => {
    debugger;
    if (! await confirm('Delete this shift?')) return;
    try { await api.delete(`/shifts/${item.id}`); await fetchData(); success('Shift deleted successfully.'); }
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
          <p className="text-sm text-gray-500">Configure shifts and late times for students, teachers and staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="bg-[#2D6CDF] px-5 py-4 text-white font-bold flex items-center gap-2">
            {selected ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {selected ? 'Edit Shift' : 'Add New Shift'}
          </div>

          <GenericForm
            fields={formFields}
            initialData={formData ? {
              ...formData
            } : {}}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            submitLabel={selected ? 'Update Shift' : 'Add Shift'}
            formCssClass="p-5 space-y-4"
          />
        </div>

        {/* Right Table Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <td className="px-5 py-4 text-sm text-gray-600">{item.startTime || ''}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.endTime || ''}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.studentLateTime || ''}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
      <ConfirmDialog isOpen={confirmState.isOpen} onConfirm={handleConfirm} onCancel={handleCancel} message={confirmState.message} />
    </div>
  );
}

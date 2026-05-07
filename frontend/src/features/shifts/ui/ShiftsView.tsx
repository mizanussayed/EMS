import { useMemo, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import GenericForm, { type FormField } from '@/components/GenericForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ToastContainer } from '@/components/Toast';
import { useConfirm, useToast } from '@/hooks/useToast';
import { useCreateShiftMutation, useDeleteShiftMutation, useShifts, useUpdateShiftMutation } from '../hooks/useShifts';
import type { Shift, ShiftInput } from '../model/shift.types';

const initialFormData: ShiftInput = {
  name: '',
  startTime: '',
  endTime: '',
  studentLateTime: '',
  teacherLateTime: '',
  staffLateTime: '',
  isActive: true,
};

const formFields: FormField[] = [
  { name: 'name', label: 'Shift Name', type: 'text', placeholder: 'Day Shift', required: true },
  { name: 'startTime', label: 'Start Time', type: 'time', required: true },
  { name: 'endTime', label: 'End Time', type: 'time', required: true },
  { name: 'teacherLateTime', label: 'Teacher Late Time', type: 'time' },
  { name: 'studentLateTime', label: 'Student Late Time', type: 'time' },
  { name: 'staffLateTime', label: 'Staff Late Time', type: 'time' },
  { name: 'isActive', label: 'Is Active', type: 'checkbox' },
];

export default function ShiftsView() {
  const { data = [], isLoading, error } = useShifts();
  const createMutation = useCreateShiftMutation();
  const updateMutation = useUpdateShiftMutation();
  const deleteMutation = useDeleteShiftMutation();
  const { toasts, remove, success, error: showError } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Shift | null>(null);
  const [formData, setFormData] = useState<ShiftInput>(initialFormData);

  const filtered = useMemo(
    () => data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [data, searchTerm]
  );

  const resetForm = () => {
    setSelected(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (payload: ShiftInput) => {
    try {
      if (selected) {
        await updateMutation.mutateAsync({ id: selected.id, payload });
        success('Shift updated successfully.');
      } else {
        await createMutation.mutateAsync(payload);
        success('Shift saved successfully.');
      }

      resetForm();
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to save shift.');
    }
  };

  const handleDelete = async (item: Shift) => {
    const confirmed = await confirm(`Delete shift "${item.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(item.id);
      success('Shift deleted successfully.');
      if (selected?.id === item.id) {
        resetForm();
      }
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to delete shift.');
    }
  };

  const handleEdit = (item: Shift) => {
    setSelected(item);
    setFormData({
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime,
      teacherLateTime: item.teacherLateTime ?? '',
      studentLateTime: item.studentLateTime ?? '',
      staffLateTime: item.staffLateTime ?? '',
      isActive: item.isActive,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-sm text-gray-500">Configure shifts and late times for students, teachers and staff.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load shifts.'}
        </div>
      )}

      <div className="mb-4">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search shifts..."
          className="w-full max-w-sm px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="bg-[#2D6CDF] px-5 py-4 text-white font-bold flex items-center gap-2">
            {selected ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {selected ? 'Edit Shift' : 'Add New Shift'}
          </div>

          <GenericForm
            fields={formFields}
            initialData={formData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            submitLabel={selected ? 'Update Shift' : 'Add Shift'}
            isLoading={createMutation.isPending || updateMutation.isPending}
            formCssClass="p-5 space-y-4"
          />
        </div>

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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500 text-sm">
                      Loading shifts...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500 text-sm">
                      No shifts found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={confirmState.message}
        title={confirmState.title}
        confirmLabel={confirmState.confirmLabel}
      />
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast, useConfirm } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import GenericForm, { type FormField } from '@/components/GenericForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { StudentBadge } from '../model/badge.types';
import { useBadges, useCreateBadgeMutation, useDeleteBadgeMutation, useUpdateBadgeMutation } from '../hooks/useBadges';


const formFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
  { name: 'isActive', label: 'Is Active', type: 'checkbox' },
];

export default function BadgesView() {
  const { data = [], isLoading } = useBadges();
  const createBadgeMutation = useCreateBadgeMutation();
  const updateBadgeMutation = useUpdateBadgeMutation();
  const deleteBadgeMutation = useDeleteBadgeMutation();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<StudentBadge | null>(null);
  const [formData, setFormData] = useState<Partial<StudentBadge>>({
    name: '',
    description: '',
    isActive: true,
  });



  const resetForm = () => {
    setSelected(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleSubmit = async (submittedFormData: any) => {
    try {
      if (!selected) {
        await createBadgeMutation.mutateAsync(submittedFormData);
      } else {
        await updateBadgeMutation.mutateAsync({ id: selected.id, payload: submittedFormData });
      }
      success('Student badge saved successfully.');
      resetForm();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (item: StudentBadge) => {
    if (!await confirm(`Delete Badge "${item.name}"?`)) return;
    try {
      await deleteBadgeMutation.mutateAsync(item.id);
      success('Student badge deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleEdit = (item: StudentBadge) => {
    setSelected(item);
    setFormData(item);
  };

  const filtered = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Badges Management</h1>
          <p className="text-sm text-gray-500">Configure student badges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="bg-[#2D6CDF] px-5 py-4 text-white font-bold flex items-center gap-2">
            {selected ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {selected ? 'Edit Badge' : 'Add New Badge'}
          </div>

          <GenericForm
            fields={formFields}
            initialData={formData ? { ...formData } : {}}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            submitLabel={selected ? 'Update Badge' : 'Add Badge'}
            formCssClass="p-5 space-y-4"
          />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Description</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Students</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.description || ''}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.studentCount || 0}</td>
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
                      No badges found.
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

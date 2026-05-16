import { useState } from 'react';
import { BadgePlus, Edit, Trash2 } from 'lucide-react';
import { useToast, useConfirm } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import GenericForm, { type FormField } from '@/components/GenericForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import SectionHeader from '@/components/SectionHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import type { StudentBadge } from '../model/badge.types';
import { useBadges, useCreateBadgeMutation, useDeleteBadgeMutation, useUpdateBadgeMutation } from '../hooks/useBadges';


const formFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
  { name: 'isActive', label: 'Is Active', type: 'checkbox' },
];

export default function BadgesView() {
  const { data = [] } = useBadges();
  const createBadgeMutation = useCreateBadgeMutation();
  const updateBadgeMutation = useUpdateBadgeMutation();
  const deleteBadgeMutation = useDeleteBadgeMutation();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [selected, setSelected] = useState<StudentBadge | null>(null);
  const [formData, setFormData] = useState<Partial<StudentBadge>>({
    name: '',
    description: '',
    color: 'green',
    isActive: true,
  });



  const resetForm = () => {
    setSelected(null);
    setFormData({ name: '', description: '', color: 'green', isActive: true });
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

  const badges = data;

  return (
    <div className="p-6">
      <SectionHeader
        icon={BadgePlus}
        title="Badges Management"
        subtitle="Configure student badges"
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <SectionHeader
            icon={selected ? Edit : BadgePlus}
            title={selected ? 'Edit Badge' : 'Add New Badge'}
            subtitle={selected ? 'Update badge details and active state' : 'Create a new student badge'}
            className="p-5 pb-0"
          />

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
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Color</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {badges.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.description || ''}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.color || ''}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.isActive ? 'Active' : 'Inactive'} />
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
                {badges.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center">
                      <EmptyState
                        title="No badges found"
                        subtitle="Create the first badge using the form on the left"
                      />
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

import { useMemo, useState } from 'react';
import { DollarSign, Settings, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useFeeStructures, useCreateFeeStructureMutation, useUpdateFeeStructureMutation, useDeleteFeeStructureMutation } from '../hooks/useFees';
import { useClasses } from '@/features/classes/hooks/useClasses';
import Modal from '@/components/Modal';
import GenericForm, { type FormField } from '@/components/GenericForm';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import type { FeeStructure, CreateFeeStructureInput, UpdateFeeStructureInput } from '../model/fee.types';

const MONTH_OPTIONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface FeeConfigProps {
  onConfigUpdate?: () => void;
}

export default function FeeConfigurationView({ onConfigUpdate }: FeeConfigProps) {
  const { success, error } = useToast();
  const { data: structures = [], isLoading } = useFeeStructures();
  const { data: classesData = [] } = useClasses();
  const createMutation = useCreateFeeStructureMutation();
  const updateMutation = useUpdateFeeStructureMutation();
  const deleteMutation = useDeleteFeeStructureMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  const classOptions = classesData.map((c) => ({
    label: c.section ? `${c.name} - ${c.section}` : c.name,
    value: String(c.id),
  }));

  const monthOptions = useMemo(
    () => MONTH_OPTIONS.map((month) => ({ label: month, value: month })),
    []
  );

  const formFields: FormField[] = [
    { name: 'classId', label: 'Class', type: 'select', options: classOptions, required: true },
    { name: 'month', label: 'Month', type: 'select', options: monthOptions, required: true },
    { name: 'amount', label: 'Fee Amount ($)', type: 'number', placeholder: 'Enter amount', required: true },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'e.g., Monthly tuition fee' },
  ];

  const handleSubmit = async (formData: any) => {
    try {
      if (modalMode === 'add') {
        const payload: CreateFeeStructureInput = {
          classId: Number(formData.classId),
          month: formData.month,
          amount: Number(formData.amount),
          description: formData.description,
        };
        await createMutation.mutateAsync(payload);
        success('Fee structure created successfully.');
      } else if (selectedStructure) {
        const payload: UpdateFeeStructureInput = {
          month: formData.month,
          amount: Number(formData.amount),
          description: formData.description,
          isActive: selectedStructure.isActive,
        };
        await updateMutation.mutateAsync({ id: selectedStructure.id, payload });
        success('Fee structure updated successfully.');
      }
      setShowModal(false);
      setSelectedStructure(null);
      onConfigUpdate?.();
    } catch (err: any) {
      error(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (structure: FeeStructure) => {
    if (!confirm(`Delete fee structure for ${structure.className} - ${structure.month}?`)) return;
    try {
      await deleteMutation.mutateAsync(structure.id);
      success('Fee structure deleted successfully.');
      onConfigUpdate?.();
    } catch (err: any) {
      error(err.message || 'An error occurred');
    }
  };

  const handleToggleStatus = async (structure: FeeStructure) => {
    try {
      const payload: UpdateFeeStructureInput = {
        month: structure.month,
        amount: structure.amount,
        description: structure.description,
        isActive: !structure.isActive,
      };
      await updateMutation.mutateAsync({ id: structure.id, payload });
      success(`Fee structure ${!structure.isActive ? 'activated' : 'deactivated'} successfully.`);
      onConfigUpdate?.();
    } catch (err: any) {
      error(err.message || 'An error occurred');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading fee structures...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Settings}
        title="Fee Structure Configuration"
        subtitle="Manage class-wise fee structures"
        action={{
          label: 'New Structure',
          onClick: () => {
            setModalMode('add');
            setSelectedStructure(null);
            setShowModal(true);
          },
          icon: Plus,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {structures.map((structure) => (
          <div key={structure.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{structure.className}</p>
                <p className="text-gray-900 font-bold text-lg mt-1">{structure.month}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleToggleStatus(structure)}
                  className={`p-2 rounded-lg transition-colors ${structure.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  title={structure.isActive ? 'Deactivate' : 'Activate'}
                >
                  {structure.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setSelectedStructure(structure);
                    setModalMode('edit');
                    setShowModal(true);
                  }}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(structure)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-black text-gray-900">{structure.amount}</span>
            </div>
            {structure.description && <p className="text-xs text-gray-400 mb-3">{structure.description}</p>}
            <StatusBadge status={structure.isActive ? 'Active' : 'Inactive'} />
          </div>
        ))}
      </div>

      {structures.length === 0 && !isLoading && (
        <EmptyState
          title="No fee structures configured yet"
          subtitle="Create your first fee structure to get started"
          action={{
            label: 'Create Structure',
            onClick: () => {
              setModalMode('add');
              setSelectedStructure(null);
              setShowModal(true);
            },
          }}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Create Fee Structure' : 'Edit Fee Structure'}
        subtitle={modalMode === 'add' ? 'Create a class-wise monthly fee structure' : 'Update the selected fee structure'}
      >
        <GenericForm
          fields={formFields}
          initialData={selectedStructure ? { ...selectedStructure, classId: String(selectedStructure.classId) } : {}}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel={modalMode === 'add' ? 'Create Structure' : 'Update Structure'}
        />
      </Modal>
    </div>
  );
}

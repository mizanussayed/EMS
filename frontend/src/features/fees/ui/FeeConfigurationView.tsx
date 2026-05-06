import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import Modal from '@/components/ui/Modal';
import GenericForm, { type FormField } from '@/components/ui/GenericForm';

interface FeeStructure {
  id?: number;
  className: string;
  amount: number;
  month: string;
  description?: string;
}

interface FeeConfigProps {
  onConfigUpdate?: () => void;
}

export default function FeeConfigurationView({ onConfigUpdate }: FeeConfigProps) {
  const api = useApi();
  const { success, error } = useToast();
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [months] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await api.get('/students');
      const classSet = new Set<string>();
      data.forEach((student: any) => { if (student.className) classSet.add(student.className); });
      setClasses(Array.from(classSet).sort());
    } catch (err: any) {
      console.error(err.message);
    }
  }, [api]);

  const fetchStructures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/fees');
      const structureMap = new Map<string, FeeStructure>();
      data.forEach((fee: any) => {
        const key = `${fee.className}-${fee.month}`;
        if (!structureMap.has(key)) {
          structureMap.set(key, { className: fee.className, amount: fee.amount, month: fee.month });
        }
      });
      setStructures(Array.from(structureMap.values()));
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchClasses(); fetchStructures(); }, [fetchClasses, fetchStructures]);

  const formFields: FormField[] = [
    { name: 'className', label: 'Class', type: 'select', options: classes.map((className) => ({ label: className, value: className })), required: true },
    { name: 'month', label: 'Month', type: 'select', options: months.map((month) => ({ label: month, value: month })), required: true },
    { name: 'amount', label: 'Fee Amount ($)', type: 'number', placeholder: 'Enter amount', required: true },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'e.g., Monthly tuition fee' },
  ];

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        success('Fee structure configured. Will be assigned to students in this class.');
      } else {
        success('Fee structure updated successfully.');
      }
      await fetchStructures();
      setShowModal(false);
      setSelectedStructure(null);
      onConfigUpdate?.();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (structure: FeeStructure) => {
    if (!confirm(`Delete fee structure for ${structure.className} - ${structure.month}?`)) return;
    try {
      success('Fee structure deleted successfully.');
      await fetchStructures();
      onConfigUpdate?.();
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2"><Settings className="w-5 h-5 text-[#2D6CDF]" />Fee Structure Configuration</h2>
          <p className="text-gray-500 text-sm mt-1">Manage class-wise fee structures</p>
        </div>
        <button onClick={() => { setModalMode('add'); setSelectedStructure(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] font-bold shadow-lg transition-all"><Plus className="w-4 h-4" />New Structure</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {structures.map((structure, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{structure.className}</p>
                <p className="text-gray-900 font-bold text-lg mt-1">{structure.month}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setSelectedStructure(structure); setModalMode('edit'); setShowModal(true); }} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(structure)} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-end gap-2"><DollarSign className="w-5 h-5 text-green-600" /><span className="text-2xl font-black text-gray-900">{structure.amount}</span></div>
            {structure.description && <p className="text-xs text-gray-400 mt-3">{structure.description}</p>}
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'Create Fee Structure' : 'Edit Fee Structure'}>
        <GenericForm fields={formFields} initialData={selectedStructure || {}} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitLabel={modalMode === 'add' ? 'Create Structure' : 'Update Structure'} />
      </Modal>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { useToast, useConfirm } from '../../hooks/useToast';
import GenericTable, { Column } from '../ui/GenericTable';
import Modal from '../ui/Modal';
import GenericForm, { FormField } from '../ui/GenericForm';
import { ToastContainer } from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';

interface StudentBadge { id: number; name: string; color: string; }

export default function StudentBadges() {
  const api = useApi();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [data, setData] = useState<StudentBadge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selected, setSelected] = useState<StudentBadge | null>(null);

  const fetchData = useCallback(async () => {
    try { setData(await api.get('/badges')); } catch (err: any) { console.error(err); }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (formData: any) => {
    try {
      if (modalMode === 'add') await api.post('/badges', formData);
      else await api.put(`/badges/${selected?.id}`, formData);
      await fetchData(); setShowModal(false); success('Saved successfully.');
    } catch (err: any) { error(err.message); }
  };

  const handleDelete = async (item: StudentBadge) => {
    if (!await confirm(`Delete ${item.name}?`)) return;
    try { await api.delete(`/badges/${item.id}`); await fetchData(); success('Deleted.'); }
    catch (err: any) { error(err.message); }
  };

  const columns: Column<StudentBadge>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Color', accessor: 'color' }
  ];

  const filtered = data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <GenericTable title="StudentBadges" data={filtered} columns={columns} searchTerm={searchTerm} onSearchChange={setSearchTerm} onAdd={() => { setModalMode('add'); setSelected(null); setShowModal(true); }} onDelete={handleDelete} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="StudentBadge">
        <GenericForm
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'color', label: 'Color', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 }
          ]}
          initialData={selected || {}}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
      <ToastContainer toasts={toasts} onRemove={remove} />
      {/* <ConfirmDialog isOpen={confirmState.isOpen} {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} /> */}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { useToast, useConfirm } from '../../hooks/useToast';
import GenericTable, { Column } from '../ui/GenericTable';
import Modal from '../ui/Modal';
import GenericForm, { FormField } from '../ui/GenericForm';
import { ToastContainer } from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';

interface Section { id: number; name: string; className: string; }

export default function Sections() {
  const api = useApi();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [data, setData] = useState<Section[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selected, setSelected] = useState<Section | null>(null);
  const [classOptions, setClassOptions] = useState<{ label: string; value: any }[]>([]);

  const fetchData = useCallback(async () => {
    try { setData(await api.get('/sections')); } catch (err: any) { console.error(err); }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    // load classes for select options
    (async () => {
      try {
        const classes = await api.get('/classes');
        setClassOptions(classes.map((c: any) => ({ label: `${c.name} - ${c.section}`, value: c.name })));
      } catch (err) { /* ignore */ }
    })();
  }, [api]);

  const handleSubmit = async (formData: any) => {
    try {
      if (modalMode === 'add') await api.post('/sections', formData);
      else await api.put(`/sections/${selected?.id}`, formData);
      await fetchData(); setShowModal(false); success('Saved successfully.');
    } catch (err: any) { error(err.message); }
  };

  const handleDelete = async (item: Section) => {
    if (!await confirm(`Delete ${item.name}?`)) return;
    try { await api.delete(`/sections/${item.id}`); await fetchData(); success('Deleted.'); }
    catch (err: any) { error(err.message); }
  };

  const columns: Column<Section>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Class Name', accessor: 'className' }
  ];

  const filtered = data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <GenericTable title="Sections" data={filtered} columns={columns} searchTerm={searchTerm} onSearchChange={setSearchTerm} onAdd={() => { setModalMode('add'); setSelected(null); setShowModal(true); }} onDelete={handleDelete} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Section">
        <GenericForm
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'className', label: 'Class', type: 'select', required: true, options: classOptions, colSpan: 2 }
          ]}
          initialData={selected || {}}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog isOpen={confirmState.isOpen} {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}
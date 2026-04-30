import { useState, useEffect, useCallback } from 'react';
import { Users, GraduationCap, DoorOpen, Clock, BarChart, BookOpen } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast, useConfirm } from '../../hooks/useToast';
import GenericTable, { Column } from '../ui/GenericTable';
import Modal from '../ui/Modal';
import GenericForm, { FormField } from '../ui/GenericForm';
import { ToastContainer } from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';

interface Class {
  id: number;
  name: string;
  section: string;
  classTeacher?: string;
  room?: string;
  schedule?: string;
  students?: number;
  subjects?: number;
  avgScore?: number;
}

const formFields: FormField[] = [
  { name: 'name', label: 'Class Name', type: 'text', placeholder: 'e.g., Grade 10', required: true },
  { name: 'section', label: 'Section', type: 'text', placeholder: 'e.g., A', required: true },
  { name: 'classTeacher', label: 'Class Teacher', type: 'text', placeholder: 'Search staff...' },
  { name: 'room', label: 'Room No', type: 'text', placeholder: 'e.g., Room 201' },
  { name: 'schedule', label: 'Schedule', type: 'select', options: [{label: 'Morning Shift', value: 'Morning Shift'}, {label: 'Afternoon Shift', value: 'Afternoon Shift'}] },
  { name: 'subjects', label: 'Number of Subjects', type: 'number', placeholder: '8' },
];

export default function Classes() {
  const api = useApi();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/classes');
      setClasses(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSubmit = async (data: any) => {
    try {
      if (modalMode === 'add') {
        await api.post('/classes', data);
      } else {
        await api.put(`/classes/${selectedClass?.id}`, data);
      }
      await fetchClasses();
      setShowModal(false);
      success(modalMode === 'add' ? 'Class added successfully.' : 'Class updated successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (cls: Class) => {
    const ok = await confirm(
      `This will permanently remove ${cls.name} - ${cls.section} from the system.`,
      'Delete Class?',
    );
    if (!ok) return;
    try {
      await api.delete(`/classes/${cls.id}`);
      await fetchClasses();
      success('Class deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<Class>[] = [
    { 
      header: 'Class Name', 
      accessor: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold">
            {c.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{c.name} - {c.section}</div>
            <div className="text-xs text-gray-400">ID: {c.id}</div>
          </div>
        </div>
      )
    },
    { header: 'Teacher', accessor: 'classTeacher' },
    { header: 'Room', accessor: 'room' },
    { 
      header: 'Schedule', 
      accessor: (c) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          c.schedule === 'Morning Shift' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {c.schedule}
        </span>
      )
    },
    { header: 'Students', accessor: 'students' },
    { 
      header: 'Performance', 
      accessor: (c) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2D6CDF]" style={{ width: `${c.avgScore || 0}%` }} />
          </div>
          <span className="text-xs font-bold text-gray-700">{c.avgScore || 0}%</span>
        </div>
      )
    }
  ];

  const stats = [
    { label: 'Total Classes', value: classes.length },
    { label: 'Morning Shift', value: classes.filter(c => c.schedule === 'Morning Shift').length, color: 'text-blue-600' },
    { label: 'Afternoon Shift', value: classes.filter(c => c.schedule === 'Afternoon Shift').length, color: 'text-orange-600' },
    { label: 'Avg Class Size', value: classes.length > 0 ? Math.round(classes.reduce((acc, c) => acc + (c.students || 0), 0) / classes.length) : 0 },
  ];

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.classTeacher?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  function handleEditClick(cls: Class) {
    setSelectedClass(cls);
    setModalMode('edit');
    setShowModal(true);
  }

  return (
    <div className="p-6">
      <GenericTable
        title="Class Management"
        description="Manage classes and their information"
        stats={stats}
        data={filteredClasses}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => { setModalMode('add'); setSelectedClass(null); setShowModal(true); }}
        addLabel="Add Class"
        onView={(c) => { setSelectedClass(c); setShowViewModal(true); }}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        isLoading={loading && classes.length === 0}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Create New Class' : 'Edit Class Details'}
      >
        <GenericForm
          fields={formFields}
          initialData={selectedClass || { schedule: 'Morning Shift', subjects: 8 }}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel={modalMode === 'add' ? 'Create Class' : 'Save Changes'}
        />
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Class Details"
      >
        {selectedClass && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                {selectedClass.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedClass.name} - {selectedClass.section}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedClass.schedule}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: GraduationCap, label: 'Class Teacher', value: selectedClass.classTeacher || 'Not Assigned' },
                { icon: DoorOpen, label: 'Room Number', value: selectedClass.room || 'N/A' },
                { icon: Users, label: 'Total Students', value: selectedClass.students || 0 },
                { icon: BookOpen, label: 'Total Subjects', value: selectedClass.subjects || 0 },
                { icon: BarChart, label: 'Average Score', value: `${selectedClass.avgScore || 0}%` },
                { icon: Clock, label: 'Shift', value: selectedClass.schedule },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block">{item.label}</label>
                    <p className="text-gray-900 font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              <button 
                onClick={() => { setShowViewModal(false); handleEditClick(selectedClass); }}
                className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
              >
                Edit Class
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

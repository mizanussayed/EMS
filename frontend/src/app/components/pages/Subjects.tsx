import { useState, useEffect, useCallback } from 'react';
import { BookOpen, GraduationCap, Award, Users } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast, useConfirm } from '../../hooks/useToast';
import GenericTable, { Column } from '../ui/GenericTable';
import Modal from '../ui/Modal';
import GenericForm, { FormField } from '../ui/GenericForm';
import { ToastContainer } from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';

interface Subject {
  id: number;
  name: string;
  code: string;
  teacher?: string;
  classes?: string;
  students?: number;
  credits: number;
  type: string;
}

const formFields: FormField[] = [
  { name: 'name', label: 'Subject Name', type: 'text', placeholder: 'e.g., Mathematics', required: true },
  { name: 'code', label: 'Subject Code', type: 'text', placeholder: 'e.g., MATH-10', required: true },
  { name: 'teacher', label: 'Assigned Teacher', type: 'text', placeholder: 'Search staff...' },
  { name: 'classes', label: 'Classes', type: 'text', placeholder: 'e.g., Grade 10A, 10B' },
  { name: 'credits', label: 'Credits', type: 'number', placeholder: '3' },
  { name: 'type', label: 'Type', type: 'select', options: [{label: 'Core', value: 'Core'}, {label: 'Elective', value: 'Elective'}] },
];

export default function Subjects() {
  const api = useApi();
  const { auth } = useAuth();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/subjects');
      setSubjects(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubmit = async (data: any) => {
    try {
      if (modalMode === 'add') {
        await api.post('/subjects', data);
      } else {
        await api.put(`/subjects/${selectedSubject?.id}`, data);
      }
      await fetchSubjects();
      setShowModal(false);
      success(modalMode === 'add' ? 'Subject added successfully.' : 'Subject updated successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (subject: Subject) => {
    const ok = await confirm(
      `This will permanently remove ${subject.name} from the curriculum.`,
      'Delete Subject?',
    );
    if (!ok) return;
    try {
      await api.delete(`/subjects/${subject.id}`);
      await fetchSubjects();
      success('Subject deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<Subject>[] = [
    { 
      header: 'Subject Code', 
      accessor: (s) => (
        <span className="font-bold text-gray-900">{s.code}</span>
      )
    },
    { 
      header: 'Subject Name', 
      accessor: (s) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2D6CDF]" />
          <span className="text-gray-900 font-medium">{s.name}</span>
        </div>
      )
    },
    { 
      header: 'Teacher', 
      accessor: (s) => (
        <div className="flex items-center gap-2 text-gray-600">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span>{s.teacher || 'Not Assigned'}</span>
        </div>
      )
    },
    { header: 'Classes', accessor: 'classes' },
    { header: 'Students', accessor: 'students' },
    { header: 'Credits', accessor: 'credits' },
    { 
      header: 'Type', 
      accessor: (s) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          s.type === 'Core' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
        }`}>
          {s.type}
        </span>
      )
    }
  ];

  const stats = [
    { label: 'Total Subjects', value: subjects.length },
    { label: 'Core Subjects', value: subjects.filter(s => s.type === 'Core').length, color: 'text-blue-600' },
    { label: 'Electives', value: subjects.filter(s => s.type === 'Elective').length, color: 'text-purple-600' },
    { label: 'Teachers', value: new Set(subjects.map(s => s.teacher).filter(Boolean)).size, color: 'text-green-600' },
  ];

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.teacher?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  function handleEditClick(subject: Subject) {
    setSelectedSubject(subject);
    setModalMode('edit');
    setShowModal(true);
  }

  return (
    <div className="p-6">
      <GenericTable
        title="Subject Management"
        description="Manage subjects and curriculum"
        stats={stats}
        data={filteredSubjects}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => { setModalMode('add'); setSelectedSubject(null); setShowModal(true); }}
        addLabel="Add Subject"
        onView={(s) => { setSelectedSubject(s); setShowViewModal(true); }}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        isLoading={loading && subjects.length === 0}
        canAdd={auth?.role === 'admin'}
        canEdit={auth?.role === 'admin'}
        canDelete={auth?.role === 'admin'}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Add New Subject' : 'Edit Subject'}
      >
        <GenericForm
          fields={formFields}
          initialData={selectedSubject || { type: 'Core', credits: 3 }}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel={modalMode === 'add' ? 'Add Subject' : 'Save Changes'}
        />
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Subject Details"
      >
        {selectedSubject && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                {selectedSubject.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedSubject.name}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedSubject.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: BookOpen, label: 'Subject Name', value: selectedSubject.name },
                { icon: GraduationCap, label: 'Assigned Teacher', value: selectedSubject.teacher || 'Not Assigned' },
                { icon: Users, label: 'Total Students', value: selectedSubject.students || 0 },
                { icon: Award, label: 'Credits', value: selectedSubject.credits },
                { icon: Award, label: 'Subject Type', value: selectedSubject.type },
                { icon: Users, label: 'Assigned Classes', value: selectedSubject.classes || 'None' },
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
              {auth?.role === 'admin' && (
                <button 
                  onClick={() => { setShowViewModal(false); handleEditClick(selectedSubject); }}
                  className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
                >
                  Edit Subject
                </button>
              )}
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

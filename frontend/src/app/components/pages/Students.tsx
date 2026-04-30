import { useEffect, useState, useMemo, useCallback } from 'react';
import { Mail, Phone, BookOpen, User, Calendar, MapPin } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast, useConfirm } from '../../hooks/useToast';
import GenericTable, { Column } from '../ui/GenericTable';
import Modal from '../ui/Modal';
import GenericForm, { FormField } from '../ui/GenericForm';
import { ToastContainer } from '../ui/Toast';
import ConfirmDialog from '../ui/ConfirmDialog';

interface Student {
  id: number;
  rollNo: string;
  name: string;
  className: string;
  section?: string;
  email?: string;
  phone?: string;
  parent?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  status: 'Active' | 'Inactive';
  attendance?: string;
  admissionNumber?: string;
  address?: string;
  gender?: string;
}

interface ApiStudent {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
  section?: string;
  gender?: string;
  dateOfBirth?: string;
  active: boolean;
}

const mapStudentFromApi = (student: ApiStudent): Student => ({
  id: student.id,
  rollNo: student.admissionNumber ?? `STU-${student.id}`,
  name: `${student.firstName} ${student.lastName}`.trim(),
  className: student.className ?? 'Unassigned',
  section: student.section ?? '',
  email: '',
  phone: '',
  parent: '',
  parentPhone: '',
  dateOfBirth: student.dateOfBirth ?? '',
  admissionDate: '',
  status: student.active ? 'Active' : 'Inactive',
  attendance: '—',
  admissionNumber: student.admissionNumber ?? '',
  gender: student.gender ?? '',
});

const formFields: FormField[] = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { name: 'admissionNumber', label: 'Roll/Admission No', type: 'text', placeholder: 'STU-001' },
  { name: 'gender', label: 'Gender', type: 'select', options: [{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}]},
  { name: 'className', label: 'Class', type: 'text', placeholder: 'Grade 10A', required: true },
  { name: 'section', label: 'Section', type: 'text', placeholder: 'A' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'email', label: 'Email Address', type: 'email' },
  { name: 'phone', label: 'Student Phone', type: 'tel' },
  { name: 'parent', label: 'Parent Name', type: 'text' },
  { name: 'parentPhone', label: 'Parent Phone', type: 'tel' },
  { name: 'address', label: 'Address', type: 'textarea', colSpan: 2 },
];

export default function Students() {
  const api = useApi();
  const { auth } = useAuth();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/students');
      setStudents(data.map(mapStudentFromApi));
    } catch (err: any) {
      // Errors are already logged in useApi, we can show a toast or alert here if needed
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = async (formData: any) => {
    try {
      if (modalMode === 'add') {
        await api.post('/students', formData);
      } else {
        await api.put(`/students/${selectedStudent?.id}`, formData);
      }
      await fetchStudents();
      setShowModal(false);
      success(modalMode === 'add' ? 'Student registered successfully.' : 'Student updated successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (student: Student) => {
    const ok = await confirm(
      `This will permanently remove ${student.name} from the system.`,
      'Delete Student?',
    );
    if (!ok) return;
    try {
      await api.delete(`/students/${student.id}`);
      await fetchStudents();
      success('Student deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<Student>[] = [
    { 
      header: 'Student', 
      accessor: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold">
            {s.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{s.name}</div>
            <div className="text-xs text-gray-400">{s.rollNo}</div>
          </div>
        </div>
      )
    },
    { header: 'Class', accessor: 'className' },
    { 
      header: 'Contact', 
      accessor: (s) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Mail className="w-3 h-3 text-gray-400" />
            <span>{s.email || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Phone className="w-3 h-3 text-gray-400" />
            <span>{s.phone || '—'}</span>
          </div>
        </div>
      )
    },
    { header: 'Parent', accessor: 'parent' },
    { 
      header: 'Status', 
      accessor: (s) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          s.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {s.status}
        </span>
      )
    }
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Students', value: students.length },
    { label: 'Active', value: students.filter(s => s.status === 'Active').length, color: 'text-green-600' },
    { label: 'Inactive', value: students.filter(s => s.status === 'Inactive').length, color: 'text-red-600' },
    { label: 'Avg Attendance', value: '94%', color: 'text-blue-600' },
  ];

  return (
    <div className="p-6">
      <GenericTable
        title="Student Management"
        description="View and manage student records, admissions and information"
        stats={stats}
        data={filteredStudents}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => { setModalMode('add'); setSelectedStudent(null); setShowModal(true); }}
        addLabel="Add Student"
        onView={(s) => { setSelectedStudent(s); setShowViewModal(true); }}
        onEdit={(s) => { 
          setSelectedStudent(s); 
          setModalMode('edit'); 
          setShowModal(true); 
        }}
        onDelete={handleDelete}
        isLoading={loading && students.length === 0}
        canAdd={auth?.role === 'admin'}
        canEdit={auth?.role === 'admin'}
        canDelete={auth?.role === 'admin'}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Register New Student' : 'Edit Student Details'}
      >
        <GenericForm
          fields={formFields}
          initialData={selectedStudent ? {
            firstName: selectedStudent.name.split(' ')[0],
            lastName: selectedStudent.name.split(' ').slice(1).join(' '),
            ...selectedStudent
          } : {}}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel={modalMode === 'add' ? 'Register Student' : 'Update Student'}
        />
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Student Profile Details"
      >
        {selectedStudent && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedStudent.name}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedStudent.status} Student</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: User, label: 'Admission No', value: selectedStudent.rollNo },
                { icon: BookOpen, label: 'Current Class', value: selectedStudent.className },
                { icon: Calendar, label: 'Date of Birth', value: selectedStudent.dateOfBirth || 'N/A' },
                { icon: User, label: 'Gender', value: selectedStudent.gender || 'N/A' },
                { icon: Mail, label: 'Email Address', value: selectedStudent.email || 'N/A' },
                { icon: Phone, label: 'Phone Number', value: selectedStudent.phone || 'N/A' },
                { icon: User, label: 'Parent/Guardian', value: selectedStudent.parent || 'N/A' },
                { icon: Phone, label: 'Parent Phone', value: selectedStudent.parentPhone || 'N/A' },
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
              <div className="md:col-span-2 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block">Residential Address</label>
                  <p className="text-gray-900 font-bold bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">{selectedStudent.address || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              <button 
                onClick={() => { setShowViewModal(false); setModalMode('edit'); setShowModal(true); }}
                className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
              >
                Edit Student
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
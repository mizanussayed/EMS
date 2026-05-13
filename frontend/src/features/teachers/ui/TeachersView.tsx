import { useState } from 'react';
import { Plus, Mail, Phone, BookOpen, Edit, Trash2 } from 'lucide-react';
import { useToast, useConfirm } from '@/hooks/useToast';
import GridList from '@/components/GridList';
import Modal from '@/components/Modal';
import GenericForm, { type FormField } from '@/components/GenericForm';
import { ToastContainer } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDateForInput, formatDateForAPI, formatDateForDisplay } from '@/utils/dateUtils';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Teacher, TeacherInput } from '../model/teacher.types';
import { useCreateTeacherMutation, useDeleteTeacherMutation, useTeachers, useUpdateTeacherMutation } from '../hooks/useTeachers';

const formFields: FormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter staff name', required: true, colSpan: 2 },
  { name: 'subject', label: 'Primary Subject', type: 'text', placeholder: 'e.g. Mathematics' },
  { name: 'qualification', label: 'Highest Qualification', type: 'text', placeholder: 'e.g. PhD, Masters', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'staff@school.edu', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234-567-890' },
  { name: 'experience', label: 'Years of Experience', type: 'text', placeholder: 'e.g., 5 years' },
  { name: 'dateOfJoining', label: 'Date of Joining', type: 'date' },
  { name: 'classes', label: 'Assigned Classes', type: 'text', placeholder: 'e.g., Grade 10A, 10B', colSpan: 2 },
  { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Enter full address', colSpan: 2 },
];

export default function TeachersView() {
  const { auth } = useAuth();
  const { data = [], isLoading } = useTeachers();
  const createTeacherMutation = useCreateTeacherMutation();
  const updateTeacherMutation = useUpdateTeacherMutation();
  const deleteTeacherMutation = useDeleteTeacherMutation();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      const payload: TeacherInput = {
        ...data,
        role: 'Teacher',
        status: data.status || 'Active',
        dateOfJoining: formatDateForAPI(data.dateOfJoining),
      };

      if (modalMode === 'add') {
        await createTeacherMutation.mutateAsync(payload);
      } else {
        await updateTeacherMutation.mutateAsync({ id: selectedTeacher?.id ?? 0, payload });
      }

      setShowModal(false);
      setSelectedTeacher(null);
      success(modalMode === 'add' ? 'Staff member added successfully.' : 'Staff profile updated successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm('This staff member will be permanently removed from the system.', 'Delete Staff Member?');
    if (!ok) return;
    try {
      await deleteTeacherMutation.mutateAsync(id);
      success('Staff member deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleEditClick = (teacher: Teacher) => {
    const formattedTeacher = { ...teacher, dateOfJoining: formatDateForInput(teacher.dateOfJoining) };
    setSelectedTeacher(formattedTeacher);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const filteredTeachers = data.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Staff', value: data.length },
    { label: 'Active', value: data.filter((teacher) => teacher.status === 'Active').length, color: 'text-green-600' },
    { label: 'On Leave', value: data.filter((teacher) => teacher.status === 'On Leave').length, color: 'text-orange-600' },
    { label: 'Avg Experience', value: '11y', color: 'text-blue-600' },
  ];

  const renderTeacherCard = (teacher: Teacher) => (
    <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold text-xl border border-blue-100">
            {teacher.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-0.5">{teacher.name}</h3>
            <p className="text-sm text-gray-500 font-medium">#{String(teacher.id).padStart(4, '0')} • {teacher.qualification || 'N/A'}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => handleViewClick(teacher)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="View Details">
            <BookOpen className="w-5 h-5" />
          </button>
          {auth?.role.toLowerCase() === 'admin' && (
            <>
              <button onClick={() => handleEditClick(teacher)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600" title="Edit">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(teacher.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {[
          { icon: BookOpen, label: teacher.subject || 'Not Assigned' },
          { icon: Mail, label: teacher.email },
          { icon: Phone, label: teacher.phone || 'N/A' },
          { icon: Plus, label: teacher.classes || 'No classes' },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <item.icon className="w-4 h-4" />
            </div>
            <span className="text-gray-700 font-medium truncate">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-gray-50">
        <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${teacher.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
          {teacher.status}
        </span>
        <p className="text-xs text-gray-400 font-medium">Exp: {teacher.experience || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <GridList
        title="Teacher Management"
        description="Manage teaching staff and their information"
        stats={stats}
        data={filteredTeachers}
        renderCard={renderTeacherCard}
        onAdd={() => { setModalMode('add'); setSelectedTeacher(null); setShowModal(true); }}
        addLabel="Add Teacher"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, subject, or email..."
        isLoading={isLoading}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'Add New Teacher' : 'Edit Teacher Profile'}>
        <GenericForm fields={formFields} initialData={selectedTeacher || {}} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitLabel={modalMode === 'add' ? 'Add Teacher' : 'Save Changes'} />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Teacher Details">
        {selectedTeacher && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                {selectedTeacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedTeacher.name}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedTeacher.status} Member</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Staff ID', value: String(selectedTeacher.id).padStart(4, '0') },
                { label: 'Primary Subject', value: selectedTeacher.subject || 'Not Assigned' },
                { label: 'Qualification', value: selectedTeacher.qualification || 'N/A' },
                { label: 'Experience', value: selectedTeacher.experience || 'N/A' },
                { label: 'Email Address', value: selectedTeacher.email },
                { label: 'Phone Number', value: selectedTeacher.phone || 'N/A' },
                { label: 'Date Joined', value: formatDateForDisplay(selectedTeacher.dateOfJoining) },
                { label: 'Assigned Classes', value: selectedTeacher.classes || 'None' },
              ].map((item, index) => (
                <div key={index}>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">{item.label}</label>
                  <p className="text-gray-900 font-bold">{item.value}</p>
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Current Address</label>
                <p className="text-gray-900 font-bold bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedTeacher.address || 'N/A'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              <button onClick={() => { setShowViewModal(false); handleEditClick(selectedTeacher); }} className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20">
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}

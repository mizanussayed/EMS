import { useMemo, useState } from 'react';
import { DoorOpen, Edit, GraduationCap, Plus, Trash2, Users, Clock, BookOpen } from 'lucide-react';
import GenericTable, { type Column } from '@/components/GenericTable';
import Modal from '@/components/Modal';
import GenericForm, { type FormField } from '@/components/GenericForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ToastContainer } from '@/components/Toast';
import { useConfirm, useToast } from '@/hooks/useToast';
import StatusBadge from '@/components/StatusBadge';
import { useClassLookups, useClasses, useCreateClassMutation, useDeleteClassMutation, useUpdateClassMutation } from '../hooks/useClasses';
import type { ClassInput, LookupOption, SchoolClass } from '../model/class.types';

const emptyFormData: ClassInput = {
  name: '',
  section: '',
  classTeacherId: 0,
  room: '',
  shiftId: 0,
  numberOfSubjects: 0,
  numberOfStudents: 0,
};

function toOptions(items: LookupOption[]) {
  return items.map((item) => ({ label: item.name, value: String(item.id) }));
}

export default function ClassesView() {
  const { data: classes = [], isLoading, error } = useClasses();
  const { staffQuery, shiftsQuery } = useClassLookups();
  const createMutation = useCreateClassMutation();
  const updateMutation = useUpdateClassMutation();
  const deleteMutation = useDeleteClassMutation();
  const { toasts, remove, success, error: showError } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<ClassInput>(emptyFormData);

  const teacherOptions = useMemo(() => toOptions(staffQuery.data ?? []), [staffQuery.data]);
  const shiftOptions = useMemo(() => toOptions(shiftsQuery.data ?? []), [shiftsQuery.data]);

  const teacherNameById = useMemo(() => {
    return new Map((staffQuery.data ?? []).map((item) => [item.id, item.name]));
  }, [staffQuery.data]);

  const shiftNameById = useMemo(() => {
    return new Map((shiftsQuery.data ?? []).map((item) => [item.id, item.name]));
  }, [shiftsQuery.data]);

  const enrichedClasses = useMemo(
    () =>
      classes.map((item) => ({
        ...item,
        classTeacher: item.classTeacher ?? teacherNameById.get(item.classTeacherId) ?? null,
        shift: item.shift ?? shiftNameById.get(item.shiftId) ?? null,
      })),
    [classes, shiftNameById, teacherNameById]
  );

  const formFields: FormField[] = [
    { name: 'name', label: 'Class Name', type: 'text', placeholder: 'e.g., Grade 10', required: true },
    { name: 'section', label: 'Section', type: 'text', placeholder: 'e.g., A', required: true },
    { name: 'classTeacherId', label: 'Class Teacher', type: 'select', options: teacherOptions, required: true },
    { name: 'room', label: 'Room No', type: 'text', placeholder: 'e.g., Room 201' },
    { name: 'shiftId', label: 'Shift', type: 'select', options: shiftOptions, required: true },
    { name: 'numberOfSubjects', label: 'Subjects', type: 'number', placeholder: '8', required: true },
    { name: 'numberOfStudents', label: 'Students', type: 'number', placeholder: '30', required: true },
  ];

  const stats = [
    { label: 'Total Classes', value: enrichedClasses.length },
    { label: 'Morning Shift', value: enrichedClasses.filter((item) => item.shift === 'Morning Shift').length, color: 'text-blue-600' },
    { label: 'Day Shift', value: enrichedClasses.filter((item) => item.shift === 'Day Shift').length, color: 'text-orange-600' },
    { label: 'Avg Class Size', value: enrichedClasses.length > 0 ? Math.round(enrichedClasses.reduce((acc, item) => acc + (item.numberOfStudents || 0), 0) / enrichedClasses.length) : 0 },
  ];

  const filteredClasses = enrichedClasses.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.classTeacher?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const columns: Column<SchoolClass>[] = [
    {
      header: 'Class Name',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{item.name} - {item.section}</div>
            <div className="text-xs text-gray-400">ID: {item.id}</div>
          </div>
        </div>
      ),
    },
    { header: 'Teacher', accessor: (item) => item.classTeacher || 'Not Assigned' },
    { header: 'Room', accessor: 'room' },
    {
      header: 'Shift',
      accessor: (item) => <StatusBadge status={item.shift || 'N/A'} variant={item.shift === 'Morning Shift' ? 'info' : 'warning'} />,
    },
    { header: 'Students', accessor: 'numberOfStudents' },
  ];

  const resetForm = () => {
    setSelectedClass(null);
    setFormData(emptyFormData);
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: SchoolClass) => {
    setSelectedClass(item);
    setModalMode('edit');
    setFormData({
      name: item.name,
      section: item.section,
      classTeacherId: item.classTeacherId,
      room: item.room ?? '',
      shiftId: item.shiftId,
      numberOfSubjects: item.numberOfSubjects,
      numberOfStudents: item.numberOfStudents,
    });
    setShowModal(true);
  };

  const handleSubmit = async (payload: ClassInput) => {
    const normalizedPayload: ClassInput = {
      ...payload,
      classTeacherId: Number(payload.classTeacherId),
      shiftId: Number(payload.shiftId),
      numberOfSubjects: Number(payload.numberOfSubjects),
      numberOfStudents: Number(payload.numberOfStudents),
    };

    try {
      if (modalMode === 'add') {
        await createMutation.mutateAsync(normalizedPayload);
        success('Class added successfully.');
      } else if (selectedClass) {
        await updateMutation.mutateAsync({ id: selectedClass.id, payload: normalizedPayload });
        success('Class updated successfully.');
      }

      setShowModal(false);
      resetForm();
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to save class.');
    }
  };

  const handleDelete = async (item: SchoolClass) => {
    const confirmed = await confirm(`This will permanently remove ${item.name} - ${item.section} from the system.`, 'Delete Class?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(item.id);
      success('Class deleted successfully.');
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to delete class.');
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load classes.'}
        </div>
      )}

      <GenericTable
        title="Class Management"
        description="Manage classes and their information"
        stats={stats}
        data={filteredClasses}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={openAddModal}
        addLabel="Add Class"
        onView={(item) => { setSelectedClass(item); setShowViewModal(true); }}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading && classes.length === 0}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Create New Class' : 'Edit Class Details'}
        subtitle={modalMode === 'add' ? 'Create a new class record and assign its teacher' : 'Update class details and assigned information'}
      >
        <GenericForm
          fields={formFields}
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel={modalMode === 'add' ? 'Create Class' : 'Save Changes'}
        />
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Class Details"
        subtitle="Review class information, teacher, room, and shift"
      >
        {selectedClass && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                {selectedClass.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedClass.name} - {selectedClass.section}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedClass.shift || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: GraduationCap, label: 'Class Teacher', value: selectedClass.classTeacher || 'Not Assigned' },
                { icon: DoorOpen, label: 'Room Number', value: selectedClass.room || 'N/A' },
                { icon: Users, label: 'Total Students', value: selectedClass.numberOfStudents || 0 },
                { icon: BookOpen, label: 'Total Subjects', value: selectedClass.numberOfSubjects || 0 },
                { icon: Clock, label: 'Shift', value: selectedClass.shift || 'N/A' },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block">{item.label}</label>
                    {item.label === 'Shift' ? (
                      <StatusBadge status={String(item.value)} variant={item.value === 'Morning Shift' ? 'info' : 'warning'} />
                    ) : (
                      <p className="text-gray-900 font-bold">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              <button
                onClick={() => { setShowViewModal(false); openEditModal(selectedClass); }}
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

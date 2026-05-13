import GenericForm, { FormField } from '@/components/GenericForm';
import Modal from '@/components/Modal';
import type { StudentInput } from '../model/student.types';

const buildFormFields = (classOptions: FormField['options'] = []): FormField[] => [
  { name: 'classRollNo', label: 'Class Roll No', type: 'text', placeholder: 'CRN-001', required: true },
  { name: 'admissionNumber', label: 'Admission No', type: 'text', placeholder: 'ADM-001' },
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
  { name: 'classId', label: 'Class', type: 'select', options: classOptions, required: true },
  { name: 'sectionId', label: 'Section', type: 'select', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }] },
  { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'admissionDate', label: 'Admission Date', type: 'date' },
  { name: 'email', label: 'Email Address', type: 'email' },
  { name: 'parent', label: 'Parent Name', type: 'text' },
  { name: 'parentPhone', label: 'Parent Phone', type: 'tel' },
  { name: 'address', label: 'Address', type: 'textarea', colSpan: 2 },
  { name: 'isActive', label: 'Is Active', type: 'checkbox' }
];

export const emptyStudentInput: StudentInput = {
  classRollNo: '',
  admissionNumber: '',
  name: '',
  classId: 0,
  sectionId: 0,
  email: '',
  parent: '',
  parentPhone: '',
  dateOfBirth: '',
  admissionDate: '',
  address: '',
  gender: '',
  isActive: true,
};

interface StudentFormProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: StudentInput;
  classOptions?: FormField['options'];
  isLoading?: boolean;
  onSubmit: (data: StudentInput) => void;
  onClose: () => void;
}

export default function StudentForm({
  isOpen,
  mode,
  initialData = emptyStudentInput,
  classOptions = [],
  isLoading = false,
  onSubmit,
  onClose,
}: StudentFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Register New Student' : 'Edit Student Details'}>
      <GenericForm
        fields={buildFormFields(classOptions)}
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        submitLabel={mode === 'add' ? 'Register Student' : 'Update Student'}
        isLoading={isLoading}
      />
    </Modal>
  );
}

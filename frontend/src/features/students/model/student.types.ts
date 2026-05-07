export interface Student {
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

export interface ApiStudent {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
  section?: string;
  gender?: string;
  dateOfBirth?: string;
  active: boolean;
  phone?: string;
  email?: string;
  address?: string;
  parent?: string;
  parentPhone?: string;
}

export interface StudentInput {
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className: string;
  section?: string;
  gender?: string;
  dateOfBirth?: string | null;
  email?: string;
  phone?: string;
  parent?: string;
  parentPhone?: string;
  address?: string;
  active?: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export const mapStudentFromApi = (student: ApiStudent): Student => ({
  id: student.id,
  rollNo: student.admissionNumber ?? `STU-${student.id}`,
  name: `${student.firstName} ${student.lastName}`.trim(),
  className: student.className ?? 'Unassigned',
  section: student.section ?? '',
  email: student.email ?? '',
  phone: student.phone ?? '',
  parent: student.parent ?? '',
  parentPhone: student.parentPhone ?? '',
  dateOfBirth: student.dateOfBirth ?? '',
  admissionDate: '',
  status: student.active ? 'Active' : 'Inactive',
  attendance: '-',
  admissionNumber: student.admissionNumber ?? '',
  address: student.address ?? '',
  gender: student.gender ?? '',
});

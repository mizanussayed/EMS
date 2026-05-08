export interface Student {
  id: number;
  rollNo: string;
  firstName: string;
  lastName: string;
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


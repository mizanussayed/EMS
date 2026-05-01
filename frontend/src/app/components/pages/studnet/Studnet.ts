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
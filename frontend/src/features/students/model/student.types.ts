export interface Student {
  id: number;
  classRollNo: string;
  admissionNumber?: string;
  name: string;
  className: string;
  sectionName?: string;
  email?: string;
  parent?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
  gender?: string;
  isActive: boolean;
  classId: number;
  sectionId?: number;
}

export interface StudentInput {
  classRollNo: string;
  admissionNumber?: string;
  name: string;
  classId: number;
  sectionId?: number;
  email?: string;
  parent?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
  gender?: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}


export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceStudent {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
}

export interface AttendanceApiRecord {
  id: number;
  studentId: number;
  studentName: string;
  className?: string;
  date: string;
  status: string;
  notes?: string;
}

export interface AttendanceRecord {
  studentId: number;
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

export interface SaveAttendancePayload {
  studentId: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

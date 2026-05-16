export interface Subject {
  id: number;
  name: string;
  code: string;
  teacherId?: number;
  classId: number;
  students?: number;
  fullMarks: number;
  type: string;
  teacherName?: string;
  className?: string;
}

export interface SubjectInput {
  name: string;
  code: string;
  teacherId?: number;
  classId?: number;
  fullMarks?: number;
  type: string;
}
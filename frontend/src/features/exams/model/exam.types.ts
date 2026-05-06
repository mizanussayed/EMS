export interface Exam {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  className?: string;
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  studentName: string;
  className?: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

export interface ExamInput {
  title: string;
  type: string;
  className?: string;
  startDate: string;
  endDate: string;
  status: string;
}

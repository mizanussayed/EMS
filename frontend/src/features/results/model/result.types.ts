export interface Result {
  id: number;
  studentId: number;
  studentName: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

export interface Exam {
  id: number;
  title: string;
  type: string;
}
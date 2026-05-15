export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher?: string;
  classes?: string;
  classId: number;
  students?: number;
  credits: number;
  type: string;
}

export interface SubjectInput {
  name: string;
  code: string;
  teacher?: string;
  classId?: number;
  credits?: number;
  type: string;
}
export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher?: string;
  classes?: string;
  students?: number;
  credits: number;
  type: string;
}

export interface SubjectInput {
  name: string;
  code: string;
  teacher?: string;
  classes?: string;
  credits?: number;
  type: string;
}
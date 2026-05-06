export interface SchoolClass {
  id: number;
  name: string;
  section: string;
  classTeacherId: number;
  room?: string | null;
  shiftId: number;
  numberOfSubjects: number;
  numberOfStudents: number;
  classTeacher?: string | null;
  shift?: string | null;
}

export interface ClassInput {
  name: string;
  section: string;
  classTeacherId: number;
  room?: string;
  shiftId: number;
  numberOfSubjects: number;
  numberOfStudents: number;
}

export interface LookupOption {
  id: number;
  name: string;
}

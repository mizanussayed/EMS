export interface TimetableEntry {
  id: number;
  className: string;
  subjectName: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface StudentClass {
  id: number;
  className?: string;
  firstName: string;
  lastName: string;
}

export interface TimetableInput {
  className: string;
  subjectName: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}
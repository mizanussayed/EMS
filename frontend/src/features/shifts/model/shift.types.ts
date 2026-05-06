export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  teacherLateTime?: string | null;
  studentLateTime?: string | null;
  staffLateTime?: string | null;
  isActive: boolean;
}

export interface ShiftInput {
  name: string;
  startTime: string;
  endTime: string;
  teacherLateTime?: string;
  studentLateTime?: string;
  staffLateTime?: string;
  isActive: boolean;
}

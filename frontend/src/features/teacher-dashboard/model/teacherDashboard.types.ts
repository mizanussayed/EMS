export interface TeacherDashboardSummary {
  studentCount: number;
  classCount: number;
  teacherCount: number;
  attendanceCount: number;
  presentCount: number;
  absentCount: number;
  totalFeesCollected: number;
  totalFeesPending: number;
  date: string;
}

export interface TeacherTimetableEntry {
  id: number;
  className: string;
  subjectName: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface TeacherExamItem {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  className?: string;
}

export interface TeacherEventItem {
  id: number;
  title: string;
  startDate: string;
  type: string;
}

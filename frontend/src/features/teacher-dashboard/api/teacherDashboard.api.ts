import { apiClient } from '@/services/http/apiClient';
import type {
  TeacherDashboardSummary,
  TeacherEventItem,
  TeacherExamItem,
  TeacherTimetableEntry,
} from '../model/teacherDashboard.types';

export const teacherDashboardApi = {
  getSummary: async () => {
    const response = await apiClient.get<TeacherDashboardSummary>('/dashboard');
    return response.data;
  },
  getTimetable: async () => {
    const response = await apiClient.get<TeacherTimetableEntry[]>('/timetable');
    return response.data;
  },
  getExams: async () => {
    const response = await apiClient.get<TeacherExamItem[]>('/exams');
    return response.data;
  },
  getEvents: async () => {
    const response = await apiClient.get<TeacherEventItem[]>('/events');
    return response.data;
  },
};

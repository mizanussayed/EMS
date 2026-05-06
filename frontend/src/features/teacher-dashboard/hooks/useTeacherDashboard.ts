import { useQuery } from '@tanstack/react-query';
import { teacherDashboardApi } from '../api/teacherDashboard.api';

export function useTeacherDashboardSummary() {
  return useQuery({
    queryKey: ['teacher-dashboard', 'summary'],
    queryFn: teacherDashboardApi.getSummary,
  });
}

export function useTeacherTimetable() {
  return useQuery({
    queryKey: ['teacher-dashboard', 'timetable'],
    queryFn: teacherDashboardApi.getTimetable,
  });
}

export function useTeacherExams() {
  return useQuery({
    queryKey: ['teacher-dashboard', 'exams'],
    queryFn: teacherDashboardApi.getExams,
  });
}

export function useTeacherEvents() {
  return useQuery({
    queryKey: ['teacher-dashboard', 'events'],
    queryFn: teacherDashboardApi.getEvents,
  });
}

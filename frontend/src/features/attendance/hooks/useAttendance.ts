import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import type { AttendanceRecord, AttendanceStatus, SaveAttendancePayload } from '../model/attendance.types';

const attendanceKeys = {
  students: ['attendance', 'students'] as const,
  byClass: (className: string, date: string) => ['attendance', 'class', className, date] as const,
};

export function useAttendanceStudents() {
  return useQuery({
    queryKey: attendanceKeys.students,
    queryFn: attendanceApi.getStudents,
  });
}

export function useAttendanceByClass(className: string, date: string, enabled: boolean) {
  return useQuery({
    queryKey: attendanceKeys.byClass(className, date),
    queryFn: () => attendanceApi.getByClass(className),
    enabled,
    select: (records) => records.filter((record) => record.date === date),
  });
}

export function useSaveAttendanceMutation(className: string, date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (records: AttendanceRecord[]) =>
      Promise.all(
        records.map((record) =>
          attendanceApi.save({
            studentId: record.studentId,
            date,
            status: record.status,
            notes: '',
          })
        )
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['attendance', 'class', className, date] });
    },
  });
}

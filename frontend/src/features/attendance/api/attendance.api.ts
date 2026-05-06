import { apiClient } from '@/services/http/apiClient';
import type { AttendanceApiRecord, AttendanceStudent, SaveAttendancePayload } from '../model/attendance.types';

export const attendanceApi = {
  getStudents: async () => {
    const response = await apiClient.get<AttendanceStudent[]>('/students');
    return response.data;
  },
  getByClass: async (className: string) => {
    const response = await apiClient.get<AttendanceApiRecord[]>(`/attendance/${encodeURIComponent(className)}`);
    return response.data;
  },
  save: async (payload: SaveAttendancePayload) => {
    const response = await apiClient.post('/attendance', payload);
    return response.data;
  },
};

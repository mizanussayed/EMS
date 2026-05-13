import type { NotificationSettings, SchoolInfo } from '../model/settings.types';

export const defaultSchoolInfo: SchoolInfo = {
  name: '',
  code: '',
  email: '',
  phone: '',
  address: '',
};

export const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  attendanceAlerts: true,
  feeReminders: true,
  examNotifications: true,
};
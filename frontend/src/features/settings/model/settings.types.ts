export interface SchoolInfo {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  attendanceAlerts: boolean;
  feeReminders: boolean;
  examNotifications: boolean;
}
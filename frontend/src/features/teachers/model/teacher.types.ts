export interface Teacher {
  id: number;
  name: string;
  subject?: string;
  email: string;
  phone?: string;
  qualification?: string;
  experience?: string;
  classes?: string;
  status: string;
  address?: string;
  dateOfJoining?: string;
}

export interface TeacherInput {
  name: string;
  subject?: string;
  qualification: string;
  email: string;
  phone?: string;
  experience?: string;
  classes?: string;
  address?: string;
  dateOfJoining?: string;
  role: 'Teacher';
  status: string;
}
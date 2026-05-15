export interface FeeRecord {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  month: string;
  amount: number;
  paidAmount: number;
  status: string;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface FeePaymentInput {
  amount: number;
  method: string;
}

export interface FeeStructure {
  id: number;
  classId: number;
  className: string;
  month: string;
  amount: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeeStructureInput {
  classId: number;
  month: string;
  amount: number;
  description?: string;
}

export interface UpdateFeeStructureInput {
  month: string;
  amount: number;
  description?: string;
  isActive: boolean;
}
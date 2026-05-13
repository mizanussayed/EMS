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
import { PaymentStatus, PaymentMethod } from '../enums';

export interface Payment {
  id: string;
  userId: string;
  committeeId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  method: PaymentMethod;
  receiptUrl?: string;
  referenceNumber?: string;
  status: PaymentStatus;
  lateFeeApplied?: number;
  adminNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

import { PayoutStatus, PaymentMethod } from '../enums';

export interface Payout {
  id: string;
  userId: string;
  committeeId: string;
  amount: number;
  position: number;
  scheduledDate: string;
  releasedDate?: string;
  method: PaymentMethod;
  status: PayoutStatus;
  proofUrl?: string;
  adminNote?: string;
  releasedBy?: string;
  createdAt: string;
  updatedAt: string;
}

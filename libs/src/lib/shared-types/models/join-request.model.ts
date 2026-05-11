export type JoinRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';

export interface JoinRequest {
  id: string;
  userId: string;
  committeeId: string;
  status: JoinRequestStatus;
  riskFlag: boolean;
  riskReason?: string;
  reviewedBy?: string;
  reviewNote?: string;
  requestedAt: string;
  reviewedAt?: string;
}

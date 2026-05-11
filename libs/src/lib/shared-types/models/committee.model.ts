import { CommitteeType, CommitteeStatus } from '../enums';

export interface Committee {
  id: string;
  name: string;
  description?: string;
  monthlyAmount: number;
  totalMembers: number;
  currentMembers: number;
  duration: number;
  type: CommitteeType;
  status: CommitteeStatus;
  startDate: string;
  endDate?: string;
  leaderId: string;
  isTrusted: boolean;
  lateFeeAmount: number;
  lateFeeGraceDays: number;
  requiresKyc: boolean;
  isPublic: boolean;
  totalCollected: number;
  nextPayoutDate?: string;
  nextPayoutUserId?: string;
  createdAt: string;
  updatedAt: string;
}

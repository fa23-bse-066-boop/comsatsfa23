import { TrustLevel, UserStatus, KycStatus } from '../enums';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnic?: string;
  avatar?: string;
  status: UserStatus;
  kycStatus: KycStatus;
  trustScore: number;
  trustLevel: TrustLevel;
  activeCommittees: number;
  completedCommittees: number;
  walletBalance: number;
  totalPaid: number;
  riskFlag: boolean;
  riskReason?: string;
  joinedAt: string;
  lastActiveAt: string;
  referralCode: string;
}

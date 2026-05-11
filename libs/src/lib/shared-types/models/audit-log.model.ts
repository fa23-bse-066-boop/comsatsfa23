import { AuditAction } from '../enums/audit-action.enum';

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  action: AuditAction;
  targetType: 'User' | 'Committee' | 'Payment' | 'Payout' | 'Ticket' | 'Setting' | 'System';
  targetId: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
}

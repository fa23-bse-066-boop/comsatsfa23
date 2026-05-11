import { Injectable, signal, computed } from '@angular/core';
import {
  AuditAction,
  MOCK_AUDIT_LOGS,
  MOCK_COMMITTEES,
  MOCK_JOIN_REQUESTS,
  MOCK_LEADERS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYMENTS,
  MOCK_PAYOUTS,
  MOCK_TICKETS,
  MOCK_USERS,
  Committee,
  CommitteeStatus,
  CommitteeType,
  Payment,
  PaymentStatus,
  PayoutStatus,
  UserStatus,
  TOKEN_KEYS,
} from '@dcms/shared-types';

export interface BankSettings {
  accountTitle: string;
  accountNumber: string;
  bankName: string;
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  readonly users = signal([...MOCK_USERS]);
  readonly committees = signal([...MOCK_COMMITTEES]);
  readonly payments = signal([...MOCK_PAYMENTS]);
  readonly payouts = signal([...MOCK_PAYOUTS]);
  readonly tickets = signal([...MOCK_TICKETS]);
  readonly notifications = signal([...MOCK_NOTIFICATIONS]);
  readonly auditLogs = signal([...MOCK_AUDIT_LOGS]);
  readonly joinRequests = signal([...MOCK_JOIN_REQUESTS]);
  readonly leaders = signal([...MOCK_LEADERS]);
  readonly bankSettings = signal<BankSettings>(this.loadBankSettings());

  // Live computed stats
  readonly totalUsers = computed(() => this.users().filter(u => u.id !== 'usr_admin_001').length);
  readonly totalCommittees = computed(() => this.committees().length);
  readonly activeCommittees = computed(() => this.committees().filter(c => c.status === CommitteeStatus.Active).length);
  readonly pendingPayments = computed(() => this.payments().filter(p => p.status === PaymentStatus.Pending).length);
  readonly pendingJoinRequests = computed(() => (this.joinRequests() as any[]).filter((r: any) => r.status === 'Pending').length);

  private loadBankSettings(): BankSettings {
    try {
      const saved = localStorage.getItem('dcms_bank_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { accountTitle: '', accountNumber: '', bankName: '' };
  }

  // --- Committee CRUD ---
  createCommittee(data: Partial<Committee>): void {
    const newCommittee: Committee = {
      id: 'cm_' + Date.now(),
      name: data.name!,
      description: data.description,
      monthlyAmount: data.monthlyAmount!,
      totalMembers: data.totalMembers!,
      currentMembers: 0,
      duration: data.duration!,
      type: data.type || CommitteeType.Fixed,
      status: data.status || CommitteeStatus.Draft,
      startDate: data.startDate!,
      leaderId: 'admin_001',
      isTrusted: false,
      lateFeeAmount: 0,
      lateFeeGraceDays: 3,
      requiresKyc: false,
      isPublic: true,
      totalCollected: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.committees.update(list => [newCommittee, ...list]);
    this.log(AuditAction.CommitteeCreated, 'Committee', newCommittee.id, { name: newCommittee.name });
  }

  updateCommittee(id: string, data: Partial<Committee>): void {
    this.committees.update(list =>
      list.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c)
    );
    this.log(AuditAction.CommitteeEdited, 'Committee', id, { updated: Object.keys(data) });
  }

  deleteCommittee(id: string): void {
    this.committees.update(list => list.filter(c => c.id !== id));
  }

  // --- User actions ---
  updateUserStatus(id: string, status: UserStatus): void {
    this.users.update(list => list.map(u => u.id === id ? { ...u, status } : u));
    const action = status === UserStatus.Suspended ? AuditAction.UserSuspended : AuditAction.UserBanned;
    this.log(action, 'User', id, { status });
  }

  deleteUser(id: string): void {
    this.users.update(list => list.filter(u => u.id !== id));
  }

  // --- Payment actions ---
  approvePayment(payment: Payment): void {
    this.payments.update(list =>
      list.map(p => p.id === payment.id ? { ...p, status: PaymentStatus.Approved, approvedAt: new Date().toISOString() } : p)
    );
    this.notifications.update(list => [{
      id: `notif_${Date.now()}`,
      userId: payment.userId,
      category: 'Payment' as const,
      title: 'Payment Approved',
      body: `Your payment of PKR ${payment.amount} has been approved.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }, ...list]);
    this.log(AuditAction.PaymentApproved, 'Payment', payment.id, { amount: payment.amount });
  }

  rejectPayment(payment: Payment): void {
    this.payments.update(list =>
      list.map(p => p.id === payment.id ? { ...p, status: PaymentStatus.Rejected } : p)
    );
    this.log(AuditAction.PaymentRejected, 'Payment', payment.id, {});
  }

  submitPayment(userId: string, data: { amount: number; referenceNumber: string; note: string; committeeId?: string }): void {
    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      userId,
      committeeId: data.committeeId || this.committees()[0]?.id || 'cm_001',
      amount: data.amount,
      dueDate: new Date().toISOString(),
      method: 'BankTransfer' as any,
      status: PaymentStatus.Pending,
      referenceNumber: data.referenceNumber,
      adminNote: data.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payments.update(list => [newPayment, ...list]);
  }

  // --- Join Request actions ---
  approveJoinRequest(id: string): void {
    const req = (this.joinRequests() as any[]).find((r: any) => r.id === id);
    if (!req) return;
    this.joinRequests.update(list =>
      (list as any[]).map((r: any) => r.id === id ? { ...r, status: 'Approved', reviewedAt: new Date().toISOString() } : r) as any
    );
    this.committees.update(list =>
      list.map(c => c.id === req.committeeId ? { ...c, currentMembers: c.currentMembers + 1 } : c)
    );
  }

  rejectJoinRequest(id: string): void {
    this.joinRequests.update(list =>
      (list as any[]).map((r: any) => r.id === id ? { ...r, status: 'Rejected', reviewedAt: new Date().toISOString() } : r) as any
    );
  }

  submitJoinRequest(userId: string, committeeId: string): boolean {
    const exists = this.joinRequests().some(r => r.userId === userId && r.committeeId === committeeId);
    if (exists) return false;
    const newReq = {
      id: 'req_' + Date.now(),
      userId,
      committeeId,
      status: 'Pending' as const,
      riskFlag: false,
      requestedAt: new Date().toISOString(),
    };
    this.joinRequests.update(list => [...list, newReq] as any);
    return true;
  }

  getJoinStatus(userId: string, committeeId: string): string | null {
    return (this.joinRequests() as any[]).find((r: any) => r.userId === userId && r.committeeId === committeeId)?.status ?? null;
  }

  getMyCommittees(userId: string): Committee[] {
    const approvedIds = (this.joinRequests() as any[])
      .filter((r: any) => r.userId === userId && r.status === 'Approved')
      .map((r: any) => r.committeeId);
    return this.committees().filter(c => approvedIds.includes(c.id) || c.leaderId === userId);
  }

  getPaymentsForUser(userId: string): Payment[] {
    return this.payments().filter(p => p.userId === userId);
  }

  // --- Payout actions ---
  releasePayout(id: string): void {
    this.payouts.update(list =>
      list.map(p => p.id === id ? { ...p, status: PayoutStatus.Released, releasedDate: new Date().toISOString() } : p)
    );
    this.log(AuditAction.PayoutReleased, 'Payout', id, {});
  }

  holdPayout(id: string): void {
    this.payouts.update(list =>
      list.map(p => p.id === id ? { ...p, status: PayoutStatus.Held } : p)
    );
  }

  // --- Bank Settings ---
  saveBankSettings(settings: BankSettings): void {
    this.bankSettings.set(settings);
    localStorage.setItem('dcms_bank_settings', JSON.stringify(settings));
    this.log(AuditAction.SettingChanged, 'Setting', 'bank_settings', { saved: true });
  }

  // --- Impersonate ---
  impersonateUser(userId: string): void {
    localStorage.setItem(TOKEN_KEYS.USER_TOKEN, btoa(JSON.stringify({ sub: userId, role: 'user', impersonatedBy: 'admin_001', exp: Math.floor(Date.now() / 1000) + 1800 })));
    this.log(AuditAction.AdminImpersonated, 'User', userId, {});
    window.open('/dashboard', '_blank');
  }

  // --- Audit log ---
  log(action: AuditAction, targetType: 'User' | 'Committee' | 'Payment' | 'Payout' | 'Ticket' | 'Setting' | 'System', targetId: string, metadata: Record<string, unknown>): void {
    this.auditLogs.update(logs => [{
      id: `log_${String(logs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      adminId: 'admin_001',
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: '127.0.0.1',
    }, ...logs]);
  }
}

import { Injectable, computed, inject, signal } from '@angular/core';
import {
  MOCK_COMMITTEES,
  MOCK_JOIN_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYMENTS,
  MOCK_PAYOUTS,
  MOCK_TICKETS,
  MOCK_USERS,
  Committee,
  JoinRequest,
  Payment,
  PaymentMethod,
  PaymentStatus,
  User,
  Notification,
  Payout,
  Ticket,
} from '@dcms/shared-types';
import { UserAuthService } from './user-auth.service';

export interface BankSettings {
  accountTitle: string;
  accountNumber: string;
  bankName: string;
}

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private readonly auth = inject(UserAuthService);

  readonly loading = signal(false);
  readonly users = signal<User[]>(this.loadData('users', MOCK_USERS));
  readonly committees = signal<Committee[]>(this.loadData('committees', MOCK_COMMITTEES));
  readonly payments = signal<Payment[]>(this.loadData('payments', MOCK_PAYMENTS));
  readonly payouts = signal<Payout[]>(this.loadData('payouts', MOCK_PAYOUTS));
  readonly tickets = signal<Ticket[]>(this.loadData('tickets', MOCK_TICKETS));
  readonly notifications = signal<Notification[]>(this.loadData('notifications', MOCK_NOTIFICATIONS));
  readonly joinRequests = signal<JoinRequest[]>(this.loadData('joinRequests', MOCK_JOIN_REQUESTS));
  readonly bankSettings = signal<BankSettings>(this.loadBankSettings());

  readonly currentUser = computed(() => this.auth.currentUser());
  readonly myPayments = computed(() => this.payments().filter(p => p.userId === this.currentUser().id));
  readonly myNotifications = computed(() => this.notifications().filter(n => n.userId === this.currentUser().id));
  readonly activeCommittees = computed(() => this.committees().filter(c => c.status === 'Active'));
  readonly featuredCommittees = computed(() => this.committees().filter(c => c.isPublic).slice(0, 3));
  readonly nextPayment = computed(() => this.myPayments().find(p => p.status !== PaymentStatus.Approved) ?? this.payments()[1]);

  readonly myCommittees = computed(() => {
    const uid = this.currentUser().id;
    const approvedIds = this.joinRequests()
      .filter(r => r.userId === uid && r.status === 'Approved')
      .map(r => r.committeeId);
    return this.committees().filter(c => approvedIds.includes(c.id) || c.leaderId === uid);
  });

  constructor() {
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('dcms_')) {
        this.syncFromStorage();
      }
    });
  }

  private loadData<T>(key: string, mockData: T[]): T[] {
    const saved = localStorage.getItem(`dcms_${key}`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    localStorage.setItem(`dcms_${key}`, JSON.stringify(mockData));
    return mockData;
  }

  private saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(`dcms_${key}`, JSON.stringify(data));
  }

  private loadBankSettings(): BankSettings {
    try {
      const saved = localStorage.getItem('dcms_bank_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { accountTitle: '', accountNumber: '', bankName: '' };
  }

  syncFromStorage() {
    this.users.set(this.loadData('users', MOCK_USERS));
    this.committees.set(this.loadData('committees', MOCK_COMMITTEES));
    this.payments.set(this.loadData('payments', MOCK_PAYMENTS));
    this.payouts.set(this.loadData('payouts', MOCK_PAYOUTS));
    this.tickets.set(this.loadData('tickets', MOCK_TICKETS));
    this.notifications.set(this.loadData('notifications', MOCK_NOTIFICATIONS));
    this.joinRequests.set(this.loadData('joinRequests', MOCK_JOIN_REQUESTS));
    this.refreshBankSettings();
  }

  // Reload bank settings from localStorage (in case admin saved them)
  refreshBankSettings(): void {
    this.bankSettings.set(this.loadBankSettings());
  }

  submitPayment(data: { amount: number; referenceNumber: string; note: string; committeeId?: string }): void {
    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      userId: this.currentUser().id,
      committeeId: data.committeeId || this.committees()[0]?.id || 'cm_001',
      amount: data.amount,
      dueDate: new Date().toISOString(),
      method: PaymentMethod.BankTransfer,
      status: PaymentStatus.Pending,
      referenceNumber: data.referenceNumber,
      adminNote: data.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payments.update(list => {
      const newList = [newPayment, ...list];
      this.saveData('payments', newList);
      return newList;
    });
  }

  joinCommittee(committee: Committee): boolean {
    const uid = this.currentUser().id;
    const exists = this.joinRequests().some(r => r.userId === uid && r.committeeId === committee.id);
    if (exists) return false;
    
    const newRequest: JoinRequest = {
      id: 'req_' + Date.now(),
      userId: uid,
      committeeId: committee.id,
      status: 'Pending',
      riskFlag: false,
      requestedAt: new Date().toISOString(),
    };
    
    this.joinRequests.update(list => {
      const newList = [newRequest, ...list];
      this.saveData('joinRequests', newList);
      return newList;
    });
    return true;
  }

  getJoinStatus(committeeId: string): string | null {
    const uid = this.currentUser().id;
    return this.joinRequests().find(r => r.userId === uid && r.committeeId === committeeId)?.status ?? null;
  }

  markNotificationsRead(): void {
    this.notifications.update(list => {
      const newList = list.map(n => n.userId === this.currentUser().id ? { ...n, isRead: true } : n);
      this.saveData('notifications', newList);
      return newList;
    });
  }
}

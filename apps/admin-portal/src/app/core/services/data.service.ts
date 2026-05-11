import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Committee, CommitteeStatus, CommitteeType, User, UserStatus, Payment, PaymentStatus, PaymentMethod, JoinRequest } from '@dcms/shared-types';
import { MOCK_USERS, MOCK_COMMITTEES, MOCK_PAYMENTS, MOCK_JOIN_REQUESTS } from '@dcms/shared-types';

export interface BankSettings {
  accountTitle: string;
  accountNumber: string;
  bankName: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  // --- State ---
  private _committees = signal<Committee[]>(this.loadData('committees', MOCK_COMMITTEES as any));
  private _users = signal<User[]>(this.loadData('users', MOCK_USERS as any));
  private _payments = signal<Payment[]>(this.loadData('payments', MOCK_PAYMENTS as any));
  private _joinRequests = signal<JoinRequest[]>(this.loadData('joinRequests', MOCK_JOIN_REQUESTS as any));
  private _bankSettings = signal<BankSettings>({
    accountTitle: '',
    accountNumber: '',
    bankName: '',
  });

  // --- Public readonly signals ---
  committees = this._committees.asReadonly();
  users = this._users.asReadonly();
  payments = this._payments.asReadonly();
  joinRequests = this._joinRequests.asReadonly();
  bankSettings = this._bankSettings.asReadonly();

  // --- Computed stats ---
  totalUsers = computed(() => this._users().filter(u => u.id !== 'usr_admin_001').length);
  totalCommittees = computed(() => this._committees().length);
  activeCommittees = computed(() => this._committees().filter(c => c.status === CommitteeStatus.Active).length);
  pendingJoinRequests = computed(() => this._joinRequests().filter(r => r.status === 'Pending').length);
  pendingPayments = computed(() => this._payments().filter(p => p.status === PaymentStatus.Pending).length);

  private readonly http = inject(HttpClient);

  constructor() {
    this.syncWithApi();
    setInterval(() => this.syncWithApi(), 3000);
  }

  private loadData<T>(key: string, mockData: T[]): T[] {
    return mockData; // Initial value before sync
  }

  private saveData<T>(key: string, data: T[]): void {
    const state = {
      users: this._users(),
      committees: this._committees(),
      payments: this._payments(),
      joinRequests: this._joinRequests(),
      bankSettings: this._bankSettings()
    };
    this.http.post('http://localhost:3000/api/sync', state).subscribe({
      error: () => console.warn('Failed to save to API')
    });
  }

  private loadBankSettings() {}

  syncWithApi() {
    this.http.get<any>('http://localhost:3000/api/sync').subscribe({
      next: (data) => {
        if (data.users) this._users.set(data.users);
        if (data.committees) this._committees.set(data.committees);
        if (data.payments) this._payments.set(data.payments);
        if (data.joinRequests) this._joinRequests.set(data.joinRequests);
        if (data.bankSettings) this._bankSettings.set(data.bankSettings);
      },
      error: () => console.warn('Failed to sync from API')
    });
  }

  // --- Committee CRUD ---
  createCommittee(data: Partial<Committee>): Committee {
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
      leaderId: 'usr_admin_001',
      isTrusted: false,
      lateFeeAmount: 0,
      lateFeeGraceDays: 3,
      requiresKyc: false,
      isPublic: true,
      totalCollected: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._committees.update(list => {
      const newList = [newCommittee, ...list];
      this.saveData('committees', newList);
      return newList;
    });
    return newCommittee;
  }

  updateCommittee(id: string, data: Partial<Committee>): void {
    this._committees.update(list => {
      const newList = list.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c);
      this.saveData('committees', newList);
      return newList;
    });
  }

  deleteCommittee(id: string): void {
    this._committees.update(list => {
      const newList = list.filter(c => c.id !== id);
      this.saveData('committees', newList);
      return newList;
    });
  }

  // --- User actions ---
  updateUserStatus(id: string, status: UserStatus): void {
    this._users.update(list => {
      const newList = list.map(u => u.id === id ? { ...u, status } : u);
      this.saveData('users', newList);
      return newList;
    });
  }

  deleteUser(id: string): void {
    this._users.update(list => {
      const newList = list.filter(u => u.id !== id);
      this.saveData('users', newList);
      return newList;
    });
  }

  // --- Payment actions ---
  approvePayment(id: string): void {
    this._payments.update(list => {
      const newList = list.map(p => p.id === id ? { ...p, status: PaymentStatus.Approved, approvedAt: new Date().toISOString() } : p);
      this.saveData('payments', newList);
      return newList;
    });
  }

  rejectPayment(id: string): void {
    this._payments.update(list => {
      const newList = list.map(p => p.id === id ? { ...p, status: PaymentStatus.Rejected } : p);
      this.saveData('payments', newList);
      return newList;
    });
  }

  submitPayment(payment: Partial<Payment>): Payment {
    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      userId: payment.userId!,
      committeeId: payment.committeeId || 'cm_001',
      amount: payment.amount!,
      dueDate: new Date().toISOString(),
      method: PaymentMethod.BankTransfer,
      status: PaymentStatus.Pending,
      referenceNumber: payment.referenceNumber,
      adminNote: payment.adminNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._payments.update(list => {
      const newList = [newPayment, ...list];
      this.saveData('payments', newList);
      return newList;
    });
    return newPayment;
  }

  // --- Join Request actions ---
  approveJoinRequest(id: string): void {
    const req = this._joinRequests().find(r => r.id === id);
    if (!req) return;
    
    this._joinRequests.update(list => {
      const newList = list.map(r => r.id === id ? { ...r, status: 'Approved' as const, reviewedAt: new Date().toISOString() } : r);
      this.saveData('joinRequests', newList);
      return newList;
    });
    
    // Increment committee member count
    this._committees.update(list => {
      const newList = list.map(c => c.id === req.committeeId ? { ...c, currentMembers: c.currentMembers + 1 } : c);
      this.saveData('committees', newList);
      return newList;
    });
  }

  rejectJoinRequest(id: string): void {
    this._joinRequests.update(list => {
      const newList = list.map(r => r.id === id ? { ...r, status: 'Rejected' as const, reviewedAt: new Date().toISOString() } : r);
      this.saveData('joinRequests', newList);
      return newList;
    });
  }

  submitJoinRequest(userId: string, committeeId: string): JoinRequest {
    const existing = this._joinRequests().find(r => r.userId === userId && r.committeeId === committeeId);
    if (existing) return existing;
    
    const newReq: JoinRequest = {
      id: 'req_' + Date.now(),
      userId,
      committeeId,
      status: 'Pending',
      riskFlag: false,
      requestedAt: new Date().toISOString(),
    };
    
    this._joinRequests.update(list => {
      const newList = [newReq, ...list];
      this.saveData('joinRequests', newList);
      return newList;
    });
    return newReq;
  }

  // --- Bank Settings ---
  saveBankSettings(settings: BankSettings): void {
    this._bankSettings.set(settings);
    localStorage.setItem('dcms_bank_settings', JSON.stringify(settings));
  }
}

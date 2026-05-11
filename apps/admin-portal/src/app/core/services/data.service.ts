import { Injectable, signal, computed } from '@angular/core';
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
  private _committees = signal<Committee[]>(this.loadData('committees', MOCK_COMMITTEES));
  private _users = signal<User[]>(this.loadData('users', MOCK_USERS));
  private _payments = signal<Payment[]>(this.loadData('payments', MOCK_PAYMENTS));
  private _joinRequests = signal<JoinRequest[]>(this.loadData('joinRequests', MOCK_JOIN_REQUESTS));
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

  constructor() {
    this.loadBankSettings();
    // Listen for storage events to sync across tabs (optional but good for Vercel demo)
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

  private loadBankSettings() {
    const saved = localStorage.getItem('dcms_bank_settings');
    if (saved) {
      try { this._bankSettings.set(JSON.parse(saved)); } catch {}
    }
  }

  syncFromStorage() {
    this._committees.set(this.loadData('committees', MOCK_COMMITTEES));
    this._users.set(this.loadData('users', MOCK_USERS));
    this._payments.set(this.loadData('payments', MOCK_PAYMENTS));
    this._joinRequests.set(this.loadData('joinRequests', MOCK_JOIN_REQUESTS));
    this.loadBankSettings();
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

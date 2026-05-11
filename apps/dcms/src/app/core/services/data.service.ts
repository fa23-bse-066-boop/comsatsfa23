import { Injectable, signal, computed } from '@angular/core';
import { Committee, CommitteeStatus, User, Payment, PaymentStatus, PaymentMethod, JoinRequest } from '@dcms/shared-types';
import { MOCK_COMMITTEES, MOCK_PAYMENTS, MOCK_JOIN_REQUESTS } from '@dcms/shared-types';

export interface BankSettings {
  accountTitle: string;
  accountNumber: string;
  bankName: string;
}

// Shared singleton state — mirrors admin DataService via localStorage
@Injectable({ providedIn: 'root' })
export class DataService {
  private _committees = signal<Committee[]>([...MOCK_COMMITTEES]);
  private _payments = signal<Payment[]>([...MOCK_PAYMENTS]);
  private _joinRequests = signal<JoinRequest[]>([...MOCK_JOIN_REQUESTS]);
  private _bankSettings = signal<BankSettings>({ accountTitle: '', accountNumber: '', bankName: '' });

  committees = this._committees.asReadonly();
  payments = this._payments.asReadonly();
  joinRequests = this._joinRequests.asReadonly();
  bankSettings = this._bankSettings.asReadonly();

  constructor() {
    this.loadBankSettings();
  }

  private loadBankSettings() {
    const saved = localStorage.getItem('dcms_bank_settings');
    if (saved) {
      try { this._bankSettings.set(JSON.parse(saved)); } catch {}
    }
  }

  getPaymentsForUser(userId: string): Payment[] {
    return this._payments().filter(p => p.userId === userId);
  }

  getMyCommittees(userId: string): Committee[] {
    const myRequestedIds = this._joinRequests()
      .filter(r => r.userId === userId && r.status === 'Approved')
      .map(r => r.committeeId);
    return this._committees().filter(c => myRequestedIds.includes(c.id) || c.leaderId === userId);
  }

  submitPayment(userId: string, data: { amount: number; referenceNumber: string; note: string; committeeId?: string }): Payment {
    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      userId,
      committeeId: data.committeeId || 'cm_001',
      amount: data.amount,
      dueDate: new Date().toISOString(),
      method: PaymentMethod.BankTransfer,
      status: PaymentStatus.Pending,
      referenceNumber: data.referenceNumber,
      adminNote: data.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._payments.update(list => [newPayment, ...list]);
    return newPayment;
  }

  submitJoinRequest(userId: string, committeeId: string): JoinRequest | null {
    const existing = this._joinRequests().find(r => r.userId === userId && r.committeeId === committeeId);
    if (existing) return null;
    const newReq: JoinRequest = {
      id: 'req_' + Date.now(),
      userId,
      committeeId,
      status: 'Pending',
      riskFlag: false,
      requestedAt: new Date().toISOString(),
    };
    this._joinRequests.update(list => [newReq, ...list]);
    return newReq;
  }

  getJoinStatus(userId: string, committeeId: string): string | null {
    const req = this._joinRequests().find(r => r.userId === userId && r.committeeId === committeeId);
    return req ? req.status : null;
  }
}

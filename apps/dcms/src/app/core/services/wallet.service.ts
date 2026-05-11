import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { WalletTransaction } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class WalletService {
  // Mock wallet data
  private walletBalance: Record<string, number> = {
    usr_001: 45000,
    usr_002: 32000,
    usr_003: 15000,
    usr_004: 0,
    usr_005: 150000,
  };

  private transactions: WalletTransaction[] = [
    {
      id: 'txn_001',
      userId: 'usr_001',
      type: 'Credit',
      amount: 50000,
      description: 'Payout received from Tech Startup Fund',
      balanceAfter: 95000,
      referenceId: 'pout_001',
      createdAt: '2026-02-01T10:30:00Z',
    },
    {
      id: 'txn_002',
      userId: 'usr_001',
      type: 'Debit',
      amount: 50000,
      description: 'Payment to Tech Startup Fund',
      balanceAfter: 45000,
      referenceId: 'pay_001',
      createdAt: '2026-05-10T06:30:00Z',
    },
  ];

  getBalance(userId: string): Observable<number> {
    return of(this.walletBalance[userId] || 0).pipe(delay(200));
  }

  getTransactions(userId: string): Observable<WalletTransaction[]> {
    return of(this.transactions.filter(t => t.userId === userId)).pipe(delay(300));
  }

  addFunds(userId: string, amount: number): Observable<number> {
    const newBalance = (this.walletBalance[userId] || 0) + amount;
    this.walletBalance[userId] = newBalance;
    return of(newBalance).pipe(delay(500));
  }

  withdraw(userId: string, amount: number): Observable<boolean> {
    const balance = this.walletBalance[userId] || 0;
    if (balance >= amount) {
      this.walletBalance[userId] = balance - amount;
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(300));
  }
}

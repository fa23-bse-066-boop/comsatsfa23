import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payout, MOCK_PAYOUTS } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class PayoutService {
  getPayouts(userId?: string): Observable<Payout[]> {
    let payouts = MOCK_PAYOUTS;
    if (userId) {
      payouts = payouts.filter(p => p.userId === userId);
    }
    return of(payouts).pipe(delay(300));
  }

  getPayoutById(id: string): Observable<Payout | undefined> {
    return of(MOCK_PAYOUTS.find(p => p.id === id)).pipe(delay(200));
  }

  getPayoutsByStatus(status: string): Observable<Payout[]> {
    return of(MOCK_PAYOUTS.filter(p => p.status === status)).pipe(delay(300));
  }

  releasePayout(id: string): Observable<boolean> {
    return of(true).pipe(delay(500));
  }

  holdPayout(id: string): Observable<boolean> {
    return of(true).pipe(delay(500));
  }
}

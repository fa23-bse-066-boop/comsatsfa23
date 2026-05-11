import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payment, MOCK_PAYMENTS } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private payments$ = new BehaviorSubject<Payment[]>(MOCK_PAYMENTS);

  getPayments(userId?: string): Observable<Payment[]> {
    let payments = MOCK_PAYMENTS;
    if (userId) {
      payments = payments.filter(p => p.userId === userId);
    }
    return of(payments).pipe(delay(300));
  }

  getPaymentById(id: string): Observable<Payment | undefined> {
    return of(MOCK_PAYMENTS.find(p => p.id === id)).pipe(delay(200));
  }

  getPaymentsByStatus(status: string, userId?: string): Observable<Payment[]> {
    let payments = MOCK_PAYMENTS.filter(p => p.status === status);
    if (userId) {
      payments = payments.filter(p => p.userId === userId);
    }
    return of(payments).pipe(delay(300));
  }

  createPayment(payment: Partial<Payment>): Observable<Payment> {
    const newPayment: Payment = {
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      ...payment,
    } as Payment;
    return of(newPayment).pipe(delay(500));
  }

  approvePayment(id: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }

  rejectPayment(id: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }
}

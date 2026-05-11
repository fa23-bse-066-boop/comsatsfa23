import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Committee, MOCK_COMMITTEES } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class CommitteeService {
  private committees$ = new BehaviorSubject<Committee[]>(MOCK_COMMITTEES);

  getCommittees(): Observable<Committee[]> {
    return this.committees$.asObservable().pipe(delay(300));
  }

  getCommitteeById(id: string): Observable<Committee | undefined> {
    return of(MOCK_COMMITTEES.find(c => c.id === id)).pipe(delay(200));
  }

  filterCommittees(filters: any): Observable<Committee[]> {
    let result = MOCK_COMMITTEES;

    if (filters.type) {
      result = result.filter(c => c.type === filters.type);
    }

    if (filters.minAmount && filters.maxAmount) {
      result = result.filter(
        c => c.monthlyAmount >= filters.minAmount && c.monthlyAmount <= filters.maxAmount
      );
    }

    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }

    return of(result).pipe(delay(300));
  }

  joinCommittee(userId: string, committeeId: string): Observable<boolean> {
    // Mock join: just return success
    return of(true).pipe(delay(500));
  }

  getMyCommittees(userId: string): Observable<Committee[]> {
    // Mock: return committees where user is or has participated
    const userCommittees = MOCK_COMMITTEES.filter(
      c => Math.random() > 0.5 // Mock: randomly select for demo
    );
    return of(userCommittees).pipe(delay(300));
  }
}

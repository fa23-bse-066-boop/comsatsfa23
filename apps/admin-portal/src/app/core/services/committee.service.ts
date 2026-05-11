import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Committee, MOCK_COMMITTEES } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class CommitteeService {
  getCommittees(): Observable<Committee[]> {
    return of(MOCK_COMMITTEES).pipe(delay(300));
  }

  getCommitteeById(id: string): Observable<Committee | undefined> {
    return of(MOCK_COMMITTEES.find(c => c.id === id)).pipe(delay(200));
  }

  pauseCommittee(id: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }

  closeCommittee(id: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }
}

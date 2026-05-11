import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, MOCK_USERS } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers(filters?: any): Observable<User[]> {
    return of(MOCK_USERS).pipe(delay(300));
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(MOCK_USERS.find(u => u.id === id)).pipe(delay(200));
  }

  suspendUser(id: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }

  banUser(id: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }
}

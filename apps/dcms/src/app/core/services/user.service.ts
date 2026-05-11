import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, MOCK_USERS } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class UserService {
  getProfile(userId: string): Observable<User | undefined> {
    return of(MOCK_USERS.find(u => u.id === userId)).pipe(delay(300));
  }

  updateProfile(userId: string, updates: Partial<User>): Observable<User> {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      return of({ ...user, ...updates }).pipe(delay(500));
    }
    throw new Error('User not found');
  }

  getUsers(filters?: any): Observable<User[]> {
    let users = MOCK_USERS;
    if (filters?.status) {
      users = users.filter(u => u.status === filters.status);
    }
    return of(users).pipe(delay(300));
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(MOCK_USERS.find(u => u.id === id)).pipe(delay(200));
  }
}

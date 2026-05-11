import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_USERS, TOKEN_KEYS, User } from '@dcms/shared-types';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  private readonly router = inject(Router);
  readonly currentUser = signal<User>(MOCK_USERS[0]);

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEYS.USER_TOKEN));
  }

  pendingRegistration: any = null;

  login(email?: string, password?: string): boolean {
    const user = email
      ? MOCK_USERS.find(u => u.email === email)
      : MOCK_USERS[0];

    if (user && (password === 'password' || !password)) {
      this.currentUser.set(user);
      localStorage.setItem(TOKEN_KEYS.USER_TOKEN, this.createToken(user.id));
      void this.router.navigateByUrl('/dashboard');
      return true;
    }
    return false;
  }

  register(): boolean {
    if (!this.pendingRegistration) return false;
    const { email, name, cnic } = this.pendingRegistration;
    const newUser = { 
      id: 'usr_' + Date.now(), 
      name, 
      email, 
      cnic,
      role: 'User', 
      status: 'Active', 
      trustScore: 100, 
      joinDate: new Date().toISOString() 
    };
    this.currentUser.set(newUser as any);
    localStorage.setItem(TOKEN_KEYS.USER_TOKEN, this.createToken(newUser.id));
    this.pendingRegistration = null;
    void this.router.navigateByUrl('/dashboard');
    return true;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEYS.USER_TOKEN);
    void this.router.navigateByUrl('/');
  }

  private createToken(userId: string): string {
    return btoa(JSON.stringify({ sub: userId, role: 'user', exp: Math.floor(Date.now() / 1000) + 86400 }));
  }
}

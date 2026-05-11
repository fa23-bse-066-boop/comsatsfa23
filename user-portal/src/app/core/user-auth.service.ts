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

  login(email?: string, password?: string): boolean {
    // Find user by email, any password works for demo
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

  logout(): void {
    localStorage.removeItem(TOKEN_KEYS.USER_TOKEN);
    void this.router.navigateByUrl('/');
  }

  private createToken(userId: string): string {
    return btoa(JSON.stringify({ sub: userId, role: 'user', exp: Math.floor(Date.now() / 1000) + 86400 }));
  }
}

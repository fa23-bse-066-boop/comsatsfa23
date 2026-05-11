import { Injectable, signal } from '@angular/core';
// auth service for apps/dcms app
import { Router } from '@angular/router';
import { User, MOCK_USERS } from '@dcms/shared-types';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'dcms_user_token';
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof localStorage === 'undefined') return;
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const user = MOCK_USERS.find(u => u.id === decoded.sub);
        if (user) { this.currentUser.set(user); this.isAuthenticated.set(true); }
      } catch { this.logout(); }
    }
  }

  login(credentials: LoginCredentials): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === credentials.email);
        if (user && credentials.password === 'password') {
          const payload = { sub: user.id, email: user.email, role: 'user', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 };
          const token = `${btoa('{}')}.${btoa(JSON.stringify(payload))}.sig`;
          if (typeof localStorage !== 'undefined') localStorage.setItem(this.TOKEN_KEY, token);
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          resolve(true);
        } else { resolve(false); }
      }, 400);
    });
  }

  register(_data: any): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = MOCK_USERS[0];
        const payload = { sub: user.id, email: user.email, role: 'user', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 };
        const token = `${btoa('{}')}.${btoa(JSON.stringify(payload))}.sig`;
        if (typeof localStorage !== 'undefined') localStorage.setItem(this.TOKEN_KEY, token);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        resolve(true);
      }, 600);
    });
  }

  logout() {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { 
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY); 
  }
}

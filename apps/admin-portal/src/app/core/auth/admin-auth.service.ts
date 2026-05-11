import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly TOKEN_KEY = 'dcms_admin_token';

  currentAdmin = signal<AdminUser | null>(null);
  isAuthenticated = signal(false);

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.TOKEN_KEY);
    if (stored) {
      try {
        const admin = JSON.parse(stored);
        this.currentAdmin.set(admin);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@example.com' && password === '123456') {
      const admin: AdminUser = { id: 'admin_001', name: 'Admin', email };
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(admin));
      this.currentAdmin.set(admin);
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentAdmin.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }
}

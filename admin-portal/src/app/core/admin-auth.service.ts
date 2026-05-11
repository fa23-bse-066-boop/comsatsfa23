import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_KEYS } from '@dcms/shared-types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly router = inject(Router);
  readonly admin = signal<AdminUser>({ id: 'admin_001', name: 'Admin', email: 'admin@example.com' });

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEYS.ADMIN_TOKEN));
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@example.com' && password === '123456') {
      localStorage.setItem(TOKEN_KEYS.ADMIN_TOKEN, btoa(JSON.stringify({ sub: 'admin_001', role: 'admin', exp: Math.floor(Date.now() / 1000) + 86400 })));
      void this.router.navigateByUrl('/dashboard');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEYS.ADMIN_TOKEN);
    void this.router.navigateByUrl('/auth/login');
  }
}

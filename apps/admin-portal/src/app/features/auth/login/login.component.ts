import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/auth/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <div class="text-center mb-8">
            <div class="text-4xl mb-3">🏦</div>
            <h1 class="text-2xl font-bold text-white">Admin Portal</h1>
            <p class="text-slate-400 mt-1">Committee Management System</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="admin@example.com"
                required
                class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            @if (error()) {
              <div class="bg-red-900/30 border border-red-700 rounded-lg p-3">
                <p class="text-sm text-red-400">{{ error() }}</p>
              </div>
            }

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-6 bg-slate-800 rounded-lg p-4 text-sm">
            <p class="text-slate-400 font-medium mb-2">Demo Credentials</p>
            <p class="text-slate-300">Email: <span class="text-blue-400">admin&#64;example.com</span></p>
            <p class="text-slate-300">Password: <span class="text-blue-400">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  private authService = inject(AdminAuthService);
  private router = inject(Router);

  email = 'admin@example.com';
  password = '123456';
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Please enter email and password');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      const success = this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid email or password');
      }
      this.loading.set(false);
    }, 400);
  }
}

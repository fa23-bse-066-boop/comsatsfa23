import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
          <div class="text-center mb-8">
            <div class="text-4xl mb-3">🏦</div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required placeholder="ahmed@example.com"
                class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••"
                class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
            </div>

            @if (error()) {
              <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error() }}</p>
              </div>
            }

            <button type="submit" [disabled]="loading()"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition">
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-6 bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm">
            <p class="text-slate-500 dark:text-slate-400 font-medium mb-2">Demo — use any of these:</p>
            <p class="text-slate-600 dark:text-slate-300">ahmed&#64;example.com / <span class="text-blue-600 dark:text-blue-400">password</span></p>
            <p class="text-slate-600 dark:text-slate-300">fatima&#64;example.com / <span class="text-blue-600 dark:text-blue-400">password</span></p>
          </div>

          <p class="text-center text-slate-500 dark:text-slate-400 mt-6 text-sm">
            Don't have an account?
            <button type="button" (click)="goToRegister()" class="text-blue-600 dark:text-blue-400 font-semibold">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Please enter email and password');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const success = await this.authService.login({ email: this.email, password: this.password });
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid email or password');
      }
    } catch {
      this.error.set('Login failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  goToRegister() { this.router.navigate(['/auth/register']); }
}

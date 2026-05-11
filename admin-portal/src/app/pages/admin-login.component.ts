import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../core/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="grid min-h-screen bg-slate-950 lg:grid-cols-[1.2fr_0.8fr]">
      <section class="hidden bg-slate-900 border-r border-slate-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <strong class="text-xl">🏦 DCMS Admin</strong>
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-blue-400">Committee Management</p>
          <h1 class="mt-4 max-w-xl text-5xl font-bold">Manage committees, users, payments and payouts.</h1>
        </div>
        <p class="text-sm text-slate-400">Secure admin portal with full audit trail.</p>
      </section>

      <section class="flex items-center justify-center p-6 bg-slate-950">
        <form class="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-8" (ngSubmit)="onSubmit()">
          <h2 class="text-3xl font-bold text-white">Admin Login</h2>
          <p class="mt-2 text-sm text-slate-400">Sign in to manage the platform</p>

          <div class="mt-6 space-y-5">
            <label class="block text-sm font-medium text-slate-300">
              Email
              <input [(ngModel)]="email" name="email" type="email" required
                class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
            </label>
            <label class="block text-sm font-medium text-slate-300">
              Password
              <input [(ngModel)]="password" name="password" type="password" required
                class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
            </label>
          </div>

          @if (error()) {
            <div class="mt-4 rounded-lg bg-red-900/30 border border-red-700 px-4 py-3">
              <p class="text-sm text-red-400">{{ error() }}</p>
            </div>
          }

          <button type="submit" [disabled]="loading()"
            class="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-600 transition">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="mt-6 rounded-lg bg-slate-800 p-4 text-sm">
            <p class="text-slate-400 font-medium mb-2">Demo Credentials</p>
            <p class="text-slate-300">Email: <span class="text-blue-400">admin&#64;example.com</span></p>
            <p class="text-slate-300">Password: <span class="text-blue-400">123456</span></p>
          </div>
        </form>
      </section>
    </main>
  `,
})
export class AdminLoginComponent {
  readonly auth = inject(AdminAuthService);

  email = 'admin@example.com';
  password = '123456';
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (!this.email || !this.password) { this.error.set('Please enter credentials'); return; }
    this.loading.set(true);
    this.error.set(null);
    setTimeout(() => {
      const ok = this.auth.login(this.email, this.password);
      if (!ok) this.error.set('Invalid email or password');
      this.loading.set(false);
    }, 400);
  }
}

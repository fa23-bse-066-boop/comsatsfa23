import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../core/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <a routerLink="/" class="mb-8 inline-block font-semibold text-brand-600 lg:hidden">DCMS</a>
    <h2 class="text-3xl font-bold">Sign in</h2>
    <p class="mt-2 text-sm text-slate-500">Use any demo email with password "password".</p>

    <form class="mt-8 space-y-5" (ngSubmit)="onSubmit()">
      <label class="block text-sm font-medium">
        Email
        <input [(ngModel)]="email" name="email" type="email" required
          class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-500 focus:outline-none" />
      </label>
      <label class="block text-sm font-medium">
        Password
        <input [(ngModel)]="password" name="password" type="password" required
          class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-500 focus:outline-none" />
      </label>

      @if (error()) {
        <div class="rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p class="text-sm text-red-600">{{ error() }}</p>
        </div>
      }

      <button type="submit" [disabled]="loading()"
        class="w-full rounded-md bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:bg-slate-400 transition">
        {{ loading() ? 'Signing in...' : 'Sign in' }}
      </button>

      <p class="text-center text-sm text-slate-500">
        New here? <a routerLink="/auth/register" class="font-semibold text-brand-600">Create an account</a>
      </p>
    </form>

    <div class="mt-6 rounded-md bg-slate-50 border border-slate-200 p-4 text-sm">
      <p class="font-medium text-slate-600 mb-2">Demo accounts (password: <span class="text-brand-600">password</span>)</p>
      <p class="text-slate-500">ahmed.raza&#64;email.com</p>
      <p class="text-slate-500">fatima.khan&#64;email.com</p>
      <p class="text-slate-500">omar.hassan&#64;email.com</p>
    </div>
  `,
})
export class LoginComponent {
  readonly auth = inject(UserAuthService);

  email = 'ahmed.raza@email.com';
  password = 'password';
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (!this.email || !this.password) { this.error.set('Please enter email and password'); return; }
    this.loading.set(true);
    this.error.set(null);
    setTimeout(() => {
      const ok = this.auth.login(this.email, this.password);
      if (!ok) this.error.set('Invalid email or password. Try: ahmed.raza@email.com / password');
      this.loading.set(false);
    }, 400);
  }
}

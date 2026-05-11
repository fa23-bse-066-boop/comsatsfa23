import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-brand-950 to-brand-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-raised p-8">
          <h1 class="text-2xl font-bold text-slate-950 dark:text-white mb-2">Create Account</h1>
          <p class="text-slate-500 dark:text-slate-400 mb-8">Join our community today</p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                formControlName="name"
                placeholder="Ahmed Raza"
                class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input
                type="email"
                formControlName="email"
                placeholder="ahmed@example.com"
                class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
                <p class="text-danger-500 text-sm mt-1">Invalid email</p>
              }
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                formControlName="phone"
                placeholder="+92 300 1234567"
                class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                <p class="text-danger-500 text-sm mt-1">Password is required</p>
              }
              @if (form.get('password')?.hasError('minlength')) {
                <p class="text-danger-500 text-sm mt-1">Password must be at least 6 characters</p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••••"
                class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              @if (passwordMismatch) {
                <p class="text-danger-500 text-sm mt-1">Passwords do not match</p>
              }
            </div>

            <!-- Terms -->
            <div class="flex items-start">
              <input
                type="checkbox"
                formControlName="terms"
                id="terms"
                class="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label for="terms" class="ml-2 text-sm text-slate-600 dark:text-slate-400">
                I agree to the Terms and Conditions
              </label>
            </div>
            @if (form.get('terms')?.hasError('required') && form.get('terms')?.touched) {
              <p class="text-danger-500 text-sm">You must accept the terms</p>
            }

            <!-- Error Message -->
            @if (error) {
              <div class="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-md p-3">
                <p class="text-sm text-danger-700 dark:text-danger-400">{{ error }}</p>
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading || !form.valid"
              class="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-semibold py-2.5 px-4 rounded-md transition duration-200"
            >
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Login Link -->
          <p class="text-center text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?
            <button type="button" (click)="goToLogin()" class="text-brand-600 hover:text-brand-700 font-semibold">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    terms: [false, Validators.required],
  });

  loading = false;
  error: string | null = null;

  get passwordMismatch(): boolean {
    const password = this.form.get('password')?.value as string | null;
    const confirm = this.form.get('confirmPassword')?.value as string | null;
    return !!(password && confirm && password !== confirm);
  }

  async onSubmit() {
    if (this.form.invalid || this.passwordMismatch) {
      this.error = 'Please fill in all fields correctly';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const success = await this.authService.register(this.form.value) as boolean;
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Registration failed. Please try again.';
      }
    } catch (_err) {
      this.error = 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}

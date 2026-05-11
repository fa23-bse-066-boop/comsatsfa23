import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserAuthService } from '../core/user-auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="text-3xl font-bold">Verify OTP</h2>
    <p class="mt-2 text-sm text-slate-500">Enter the 6-digit verification code sent to your phone/email.</p>
    <div class="mt-8 flex justify-between gap-2">
      @for (box of [1, 2, 3, 4, 5, 6]; track box) {
        <input maxlength="1" class="h-14 w-12 rounded-md border border-slate-200 text-center text-xl font-semibold focus:border-brand-500 focus:outline-none" />
      }
    </div>
    
    @if (error()) {
      <p class="mt-4 text-sm text-red-500">{{ error() }}</p>
    }

    <button (click)="verify()" [disabled]="loading()" class="mt-8 block w-full rounded-md bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-700 disabled:bg-slate-400 transition">
      {{ loading() ? 'Verifying...' : 'Verify and continue' }}
    </button>
    <p class="mt-4 text-center text-sm text-slate-500">
      Didn't receive the code? <button class="font-semibold text-brand-600 hover:underline">Resend</button>
    </p>
  `,
})
export class OtpComponent implements OnInit {
  private readonly auth = inject(UserAuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    if (!this.auth.pendingRegistration) {
      void this.router.navigateByUrl('/auth/register');
    }
  }

  verify() {
    this.loading.set(true);
    this.error.set(null);
    
    setTimeout(() => {
      const success = this.auth.register();
      if (!success) {
        this.error.set('Registration failed. Please try again.');
        this.loading.set(false);
      }
      // If success, register() handles the navigation to /dashboard
    }, 800);
  }
}

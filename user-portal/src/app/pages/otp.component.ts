import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="text-3xl font-bold">Verify OTP</h2>
    <p class="mt-2 text-sm text-slate-500">Enter the 6-digit verification code.</p>
    <div class="mt-8 grid grid-cols-6 gap-2">
      @for (box of [1, 2, 3, 4, 5, 6]; track box) {
        <input maxlength="1" class="h-12 rounded-md border border-slate-200 text-center text-xl font-semibold" />
      }
    </div>
    <a routerLink="/dashboard" class="mt-8 block rounded-md bg-brand-600 px-4 py-3 text-center font-semibold text-white">Verify and continue</a>
  `,
})
export class OtpComponent {}

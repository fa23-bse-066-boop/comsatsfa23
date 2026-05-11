import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="text-3xl font-bold">Reset password</h2>
    <form class="mt-8 space-y-5">
      <label class="block text-sm font-medium">Email or phone<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" required /></label>
      <label class="block text-sm font-medium">OTP<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" maxlength="6" required /></label>
      <label class="block text-sm font-medium">New password<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" type="password" minlength="8" required /></label>
      <a routerLink="/auth/login" class="block rounded-md bg-brand-600 px-4 py-3 text-center font-semibold text-white">Save password</a>
    </form>
  `,
})
export class ForgotPasswordComponent {}

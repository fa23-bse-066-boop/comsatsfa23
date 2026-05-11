import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="text-3xl font-bold">Create account</h2>
    <p class="mt-2 text-sm text-slate-500">Four-step KYC-ready signup flow.</p>
    <form class="mt-8 space-y-5">
      <div class="grid grid-cols-4 gap-2">
        @for (step of [1, 2, 3, 4]; track step) { <div class="h-2 rounded-full bg-brand-600"></div> }
      </div>
      <label class="block text-sm font-medium">Full name<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" required /></label>
      <label class="block text-sm font-medium">Email<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" type="email" required /></label>
      <label class="block text-sm font-medium">Phone<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" required /></label>
      <label class="block text-sm font-medium">Password<input class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" type="password" required minlength="8" /></label>
      <div class="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">CNIC front/back upload placeholder</div>
      <a routerLink="/auth/otp" class="block rounded-md bg-brand-600 px-4 py-3 text-center font-semibold text-white">Continue to OTP</a>
    </form>
  `,
})
export class RegisterComponent {}

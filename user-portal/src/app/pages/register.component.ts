import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../core/user-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <h2 class="text-3xl font-bold">Create account</h2>
    <p class="mt-2 text-sm text-slate-500">Four-step KYC-ready signup flow.</p>
    <form class="mt-8 space-y-5" (ngSubmit)="onSubmit()">
      <div class="grid grid-cols-4 gap-2">
        @for (step of [1, 2, 3, 4]; track step) { <div class="h-2 rounded-full bg-brand-600"></div> }
      </div>
      <label class="block text-sm font-medium">Full name<input [(ngModel)]="name" name="name" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" required /></label>
      <label class="block text-sm font-medium">Email<input [(ngModel)]="email" name="email" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" type="email" required /></label>
      <label class="block text-sm font-medium">Phone<input [(ngModel)]="phone" name="phone" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" required /></label>
      <label class="block text-sm font-medium">CNIC Number<input [(ngModel)]="cnic" (input)="formatCnic()" name="cnic" placeholder="XXXXX-XXXXXXX-X" maxlength="15" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" required /></label>
      <label class="block text-sm font-medium">Password<input [(ngModel)]="password" name="password" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3" type="password" required minlength="8" /></label>
      
      @if (error()) {
        <p class="text-sm text-red-500">{{ error() }}</p>
      }

      <button type="submit" [disabled]="loading()" class="block w-full rounded-md bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-700 disabled:bg-slate-400 transition">
        {{ loading() ? 'Processing...' : 'Continue to OTP' }}
      </button>
      <p class="text-center text-sm text-slate-500 mt-4">
        Already have an account? <a routerLink="/auth/login" class="font-semibold text-brand-600">Sign in</a>
      </p>
    </form>
  `,
})
export class RegisterComponent {
  readonly auth = inject(UserAuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  phone = '';
  cnic = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  formatCnic() {
    let val = this.cnic.replace(/\D/g, '');
    if (val.length > 13) val = val.substring(0, 13);
    
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = val.substring(0, 5) + '-' + val.substring(5);
    } else if (val.length > 12) {
      formatted = val.substring(0, 5) + '-' + val.substring(5, 12) + '-' + val.substring(12);
    }
    this.cnic = formatted;
  }

  onSubmit() {
    if (!this.name || !this.email || !this.cnic || !this.password) {
      this.error.set('Please fill out all required fields');
      return;
    }
    if (this.cnic.length !== 15) {
      this.error.set('Please enter a valid CNIC format (XXXXX-XXXXXXX-X)');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    
    this.auth.pendingRegistration = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      cnic: this.cnic,
      password: this.password
    };

    setTimeout(() => {
      this.loading.set(false);
      void this.router.navigateByUrl('/auth/otp');
    }, 500);
  }
}

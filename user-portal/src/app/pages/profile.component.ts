import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrustBadgeComponent, ToastService } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TrustBadgeComponent],
  template: `
    <section class="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside class="rounded-lg border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-900">
        @for (tab of tabs; track tab) {
          <button type="button" class="block w-full rounded-md px-3 py-2 text-left text-sm" [class.bg-brand-50]="activeTab() === tab" [class.text-brand-700]="activeTab() === tab" (click)="activeTab.set(tab)">{{ tab }}</button>
        }
      </aside>
      <main class="rounded-lg border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold">{{ data.currentUser().name }}</h1>
            <p class="text-slate-500">{{ data.currentUser().email }} · {{ data.currentUser().phone }}</p>
          </div>
          <app-trust-badge [level]="data.currentUser().trustLevel" [score]="data.currentUser().trustScore" />
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          @for (field of fields; track field.label) {
            <label class="block text-sm font-medium">
              {{ field.label }}
              <input [(ngModel)]="field.value" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-800" />
            </label>
          }
        </div>
        <div class="mt-8 rounded-md border border-slate-200 p-4 dark:border-slate-700">
          <h2 class="font-semibold">{{ activeTab() }}</h2>
          <p class="mt-2 text-sm text-slate-500">
            @switch (activeTab()) {
              @case ('Personal Info') {
                Update your name, email, phone and other personal details.
              }
              @case ('KYC Status') {
                Complete KYC verification to increase your trust score and unlock higher committee amounts.
              }
              @case ('Security') {
                Change password, enable 2FA, and manage login sessions.
              }
              @case ('Notifications') {
                Control email and SMS notifications for payments, payouts, and approvals.
              }
              @case ('Linked Accounts') {
                Add and manage your bank accounts for direct payouts.
              }
            }
          </p>
          <button (click)="saveProfile()" [disabled]="saving()" class="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:bg-brand-400 transition">
            {{ saving() ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </main>
    </section>
  `,
})
export class ProfileComponent {
  readonly data = inject(UserDataService);
  private readonly toast = inject(ToastService);

  readonly tabs = ['Personal Info', 'KYC Status', 'Security', 'Notifications', 'Linked Accounts'];
  readonly activeTab = signal(this.tabs[0]);
  readonly saving = signal(false);

  readonly fields = [
    { label: 'Name', value: this.data.currentUser().name },
    { label: 'Email', value: this.data.currentUser().email },
    { label: 'Phone', value: this.data.currentUser().phone },
    { label: 'CNIC', value: this.data.currentUser().cnic || 'Not submitted' },
  ];

  saveProfile() {
    this.saving.set(true);
    setTimeout(() => {
      this.toast.show('Profile updated successfully', 'success');
      this.saving.set(false);
    }, 500);
  }
}

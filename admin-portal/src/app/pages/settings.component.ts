import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminDataService, BankSettings } from '../core/admin-data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6 max-w-2xl">
      <div>
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-slate-500">Configure bank account details for user payments.</p>
      </div>

      <!-- Bank Settings -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <h2 class="mb-1 text-lg font-semibold">Bank Account Details</h2>
        <p class="mb-6 text-sm text-slate-500">These details are shown to users when they submit payments.</p>

        <div class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium">Account Title *</label>
            <input [(ngModel)]="accountTitle" type="text" placeholder="e.g. DCMS Committee Fund"
              class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium">Account Number *</label>
            <input [(ngModel)]="accountNumber" type="text" placeholder="e.g. 0123456789012345"
              class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium">Bank Name *</label>
            <input [(ngModel)]="bankName" type="text" placeholder="e.g. HBL / Meezan Bank / UBL"
              class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </div>

          @if (formError()) {
            <p class="text-sm text-red-500">{{ formError() }}</p>
          }
          @if (saved()) {
            <p class="text-sm text-emerald-600 font-medium">✅ Bank settings saved successfully!</p>
          }

          <button (click)="save()"
            class="w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 transition">
            Save Bank Settings
          </button>
        </div>
      </div>

      <!-- Current saved preview -->
      @if (data.bankSettings().accountTitle) {
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Currently Saved</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Account Title</span>
              <span class="font-medium">{{ data.bankSettings().accountTitle }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Account Number</span>
              <span class="font-medium">{{ data.bankSettings().accountNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Bank Name</span>
              <span class="font-medium">{{ data.bankSettings().bankName }}</span>
            </div>
          </div>
        </div>
      }
    </section>
  `,
})
export class SettingsComponent {
  readonly data = inject(AdminDataService);

  accountTitle = signal('');
  accountNumber = signal('');
  bankName = signal('');
  formError = signal<string | null>(null);
  saved = signal(false);

  constructor() {
    effect(() => {
      const settings = this.data.bankSettings();
      this.accountTitle.set(settings.accountTitle);
      this.accountNumber.set(settings.accountNumber);
      this.bankName.set(settings.bankName);
    });
  }

  save() {
    const title = this.accountTitle().trim();
    const number = this.accountNumber().trim();
    const bank = this.bankName().trim();

    if (!title) { this.formError.set('Account title is required'); return; }
    if (!number) { this.formError.set('Account number is required'); return; }
    if (!bank) { this.formError.set('Bank name is required'); return; }

    this.formError.set(null);
    this.data.saveBankSettings({ accountTitle: title, accountNumber: number, bankName: bank });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}

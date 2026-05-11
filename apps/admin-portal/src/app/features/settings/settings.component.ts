import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, BankSettings } from '../../core/services/data.service';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8 max-w-2xl">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white">Settings</h1>
          <p class="text-slate-400 mt-1">Configure bank account details for user payments</p>
        </div>

        <!-- Bank Settings Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 class="text-lg font-semibold text-white mb-6">Bank Account Details</h2>
          <p class="text-slate-400 text-sm mb-6">These details will be shown to users when they submit payments.</p>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Account Title *</label>
              <input [(ngModel)]="form.accountTitle" type="text" placeholder="e.g. DCMS Committee Fund"
                class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Account Number *</label>
              <input [(ngModel)]="form.accountNumber" type="text" placeholder="e.g. 0123456789012345"
                class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Bank Name *</label>
              <input [(ngModel)]="form.bankName" type="text" placeholder="e.g. HBL / Meezan Bank / UBL"
                class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>

            @if (formError()) {
              <p class="text-red-400 text-sm">{{ formError() }}</p>
            }

            <button (click)="save()" class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
              Save Bank Settings
            </button>
          </div>
        </div>

        <!-- Preview -->
        @if (data.bankSettings().accountTitle) {
          <div class="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-slate-400 uppercase mb-4">Current Saved Settings</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-slate-400 text-sm">Account Title</span>
                <span class="text-white text-sm font-medium">{{ data.bankSettings().accountTitle }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 text-sm">Account Number</span>
                <span class="text-white text-sm font-medium">{{ data.bankSettings().accountNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 text-sm">Bank Name</span>
                <span class="text-white text-sm font-medium">{{ data.bankSettings().bankName }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </app-admin-layout>
  `,
})
export class SettingsComponent {
  data = inject(DataService);
  private toast = inject(ToastService);

  formError = signal<string | null>(null);

  form: BankSettings = {
    accountTitle: this.data.bankSettings().accountTitle,
    accountNumber: this.data.bankSettings().accountNumber,
    bankName: this.data.bankSettings().bankName,
  };

  save() {
    if (!this.form.accountTitle?.trim()) { this.formError.set('Account title is required'); return; }
    if (!this.form.accountNumber?.trim()) { this.formError.set('Account number is required'); return; }
    if (!this.form.bankName?.trim()) { this.formError.set('Bank name is required'); return; }
    this.formError.set(null);
    this.data.saveBankSettings({ ...this.form });
    this.toast.show('Bank settings saved successfully', 'success');
  }
}

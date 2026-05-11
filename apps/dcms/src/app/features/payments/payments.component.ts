import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { UserLayoutComponent } from '../../core/components/user-layout.component';
import { Payment } from '@dcms/shared-types';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
          <button (click)="showPayForm.set(true)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            + Submit Payment
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-6">
          @for (s of statuses; track s) {
            <button (click)="filter.set(s)"
              [class]="filter() === s ? activeClass(s) : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">
              {{ s }}
            </button>
          }
        </div>

        <!-- Payments Table -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Reference</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Note</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredPayments(); track p.id) {
                <tr class="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">{{ p.createdAt | date:'MMM dd, yyyy' }}</td>
                  <td class="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">PKR {{ p.amount | number }}</td>
                  <td class="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">{{ p.referenceNumber || '—' }}</td>
                  <td class="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-40 truncate">{{ p.adminNote || '—' }}</td>
                  <td class="px-5 py-4">
                    <span [class]="statusClass(p.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ p.status }}</span>
                  </td>
                </tr>
              }
              @if (filteredPayments().length === 0) {
                <tr><td colspan="5" class="px-5 py-10 text-center text-slate-400">No payments found</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Submit Payment Modal -->
      @if (showPayForm()) {
        <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-md">
            <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Submit Payment</h2>
              <button (click)="closeForm()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl">✕</button>
            </div>

            <div class="p-6 space-y-5">
              <!-- Bank Details -->
              @if (bankSettings().accountTitle) {
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p class="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Pay To:</p>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-600 dark:text-slate-400">Account Title</span>
                      <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ bankSettings().accountTitle }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-600 dark:text-slate-400">Account Number</span>
                      <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ bankSettings().accountNumber }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-600 dark:text-slate-400">Bank Name</span>
                      <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ bankSettings().bankName }}</span>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p class="text-sm text-amber-700 dark:text-amber-400">⚠ Bank details not configured yet. Please contact admin.</p>
                </div>
              }

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (PKR) *</label>
                <input [(ngModel)]="payForm.amount" type="number" placeholder="e.g. 10000"
                  class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transaction Reference Number</label>
                <input [(ngModel)]="payForm.referenceNumber" type="text" placeholder="e.g. TXN123456789"
                  class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Note (optional)</label>
                <textarea [(ngModel)]="payForm.note" rows="2" placeholder="Any additional info..."
                  class="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Screenshot (optional)</label>
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                  <p class="text-sm text-slate-400">📎 Click to upload screenshot</p>
                  <p class="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              @if (formError()) {
                <p class="text-red-500 text-sm">{{ formError() }}</p>
              }
            </div>

            <div class="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
              <button (click)="closeForm()" class="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button (click)="submitPayment()" class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      }
    </app-user-layout>
  `,
})
export class PaymentsComponent {
  auth = inject(AuthService);
  private dataService = inject(DataService);
  private toast = inject(ToastService);

  statuses = ['All', 'Pending', 'Approved', 'Rejected'];
  filter = signal('All');
  showPayForm = signal(false);
  formError = signal<string | null>(null);

  payForm = { amount: null as number | null, referenceNumber: '', note: '' };

  bankSettings = this.dataService.bankSettings;

  myPayments = computed(() => {
    const uid = this.auth.currentUser()?.id;
    return uid ? this.dataService.getPaymentsForUser(uid) : [];
  });

  filteredPayments = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.myPayments() : this.myPayments().filter(p => p.status === f);
  });

  closeForm() {
    this.showPayForm.set(false);
    this.payForm = { amount: null, referenceNumber: '', note: '' };
    this.formError.set(null);
  }

  submitPayment() {
    if (!this.payForm.amount || this.payForm.amount <= 0) {
      this.formError.set('Please enter a valid amount');
      return;
    }
    const uid = this.auth.currentUser()?.id;
    if (!uid) return;

    this.dataService.submitPayment(uid, {
      amount: this.payForm.amount,
      referenceNumber: this.payForm.referenceNumber,
      note: this.payForm.note,
    });
    this.toast.show('Payment submitted — pending admin approval', 'success');
    this.closeForm();
  }

  activeClass(s: string): string {
    const m: Record<string, string> = {
      All: 'bg-blue-600 text-white',
      Pending: 'bg-amber-500 text-white',
      Approved: 'bg-emerald-600 text-white',
      Rejected: 'bg-red-600 text-white',
    };
    return m[s] || 'bg-blue-600 text-white';
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      Approved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      Rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      Late: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    };
    return m[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  }
}

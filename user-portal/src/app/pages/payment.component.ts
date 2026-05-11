import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentChipComponent, ToastService } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentChipComponent],
  template: `
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Payments</h1>
        <button (click)="showForm.set(true)"
          class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
          + Submit Payment
        </button>
      </div>

      <!-- Filter tabs -->
      <div class="flex gap-2">
        @for (f of filters; track f) {
          <button (click)="activeFilter.set(f)"
            [class]="activeFilter() === f ? activeClass(f) : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
            class="rounded-lg px-4 py-2 text-sm font-medium transition">
            {{ f }}
          </button>
        }
      </div>

      <!-- Payment History -->
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Reference</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Note</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filteredPayments(); track p.id) {
              <tr class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td class="p-4 text-slate-500">{{ p.createdAt | date:'MMM dd, yyyy' }}</td>
                <td class="p-4 font-semibold">PKR {{ p.amount | number }}</td>
                <td class="p-4 text-slate-500">{{ p.referenceNumber || '—' }}</td>
                <td class="p-4 text-slate-500 max-w-40 truncate">{{ p.adminNote || '—' }}</td>
                <td class="p-4"><app-payment-chip [status]="p.status" /></td>
              </tr>
            }
            @if (filteredPayments().length === 0) {
              <tr><td colspan="5" class="p-10 text-center text-slate-400">No payments found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    <!-- Submit Payment Modal -->
    @if (showForm()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-modal dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
            <h2 class="text-lg font-bold">Submit Payment</h2>
            <button (click)="closeForm()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
          </div>

          <div class="space-y-5 p-6">
            <!-- Bank Details -->
            @if (data.bankSettings().accountTitle) {
              <div class="rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
                <p class="mb-3 text-sm font-semibold text-brand-700 dark:text-brand-400">Pay To:</p>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Account Title</span>
                    <span class="font-semibold">{{ data.bankSettings().accountTitle }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Account Number</span>
                    <span class="font-semibold">{{ data.bankSettings().accountNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Bank Name</span>
                    <span class="font-semibold">{{ data.bankSettings().bankName }}</span>
                  </div>
                </div>
              </div>
            } @else {
              <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <p class="text-sm text-amber-700 dark:text-amber-400">⚠ Bank details not configured yet. Please contact admin.</p>
              </div>
            }

            <div>
              <label class="mb-1.5 block text-sm font-medium">Amount (PKR) *</label>
              <input [(ngModel)]="amount" type="number" placeholder="e.g. 10000"
                class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium">Transaction Reference Number</label>
              <input [(ngModel)]="referenceNumber" type="text" placeholder="e.g. TXN123456789"
                class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium">Note (optional)</label>
              <textarea [(ngModel)]="note" rows="2" placeholder="Any additional info..."
                class="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"></textarea>
            </div>

            <div class="rounded-lg border-2 border-dashed border-slate-200 p-4 text-center dark:border-slate-700">
              <p class="text-sm text-slate-400">📎 Screenshot upload (optional)</p>
              <p class="mt-1 text-xs text-slate-400">PNG, JPG up to 5MB</p>
            </div>

            @if (formError()) {
              <p class="text-sm text-red-500">{{ formError() }}</p>
            }
          </div>

          <div class="flex gap-3 border-t border-slate-200 p-6 dark:border-slate-800">
            <button (click)="closeForm()" class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 transition">Cancel</button>
            <button (click)="submit()" class="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class PaymentComponent implements OnInit {
  readonly data = inject(UserDataService);
  private readonly toast = inject(ToastService);

  filters = ['All', 'Pending', 'Approved', 'Rejected'];
  activeFilter = signal('All');
  showForm = signal(false);
  formError = signal<string | null>(null);
  amount = signal<number | null>(null);
  referenceNumber = signal('');
  note = signal('');

  filteredPayments = computed(() => {
    const f = this.activeFilter();
    return f === 'All' ? this.data.myPayments() : this.data.myPayments().filter(p => p.status === f);
  });

  ngOnInit() {
    this.data.refreshBankSettings();
  }

  closeForm() {
    this.showForm.set(false);
    this.amount.set(null);
    this.referenceNumber.set('');
    this.note.set('');
    this.formError.set(null);
  }

  submit() {
    const amountValue = this.amount();
    if (!amountValue || amountValue <= 0) {
      this.formError.set('Please enter a valid amount');
      return;
    }
    this.data.submitPayment({
      amount: amountValue,
      referenceNumber: this.referenceNumber(),
      note: this.note(),
    });
    this.toast.show('Payment submitted — pending admin approval', 'success');
    this.closeForm();
  }

  activeClass(f: string): string {
    const m: Record<string, string> = { All: 'bg-brand-600 text-white', Pending: 'bg-amber-500 text-white', Approved: 'bg-emerald-600 text-white', Rejected: 'bg-red-600 text-white' };
    return m[f] || 'bg-brand-600 text-white';
  }
}

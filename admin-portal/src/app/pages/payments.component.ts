import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment } from '@dcms/shared-types';
import { PaymentChipComponent, StatsCardComponent, ToastService } from '@dcms/shared-ui';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, PaymentChipComponent],
  template: `
    <section class="space-y-5">
      <h1 class="text-3xl font-bold">Payments</h1>

      <!-- Stats -->
      <div class="grid gap-4 md:grid-cols-4">
        <app-stats-card label="Pending"  [value]="count('Pending')"  icon="⏳" tone="danger" />
        <app-stats-card label="Approved" [value]="count('Approved')" icon="✅" tone="success" />
        <app-stats-card label="Rejected" [value]="count('Rejected')" icon="❌" />
        <app-stats-card label="Late"     [value]="count('Late')"     icon="⚠" />
      </div>

      <!-- Filter -->
      <div class="flex gap-2">
        @for (f of filters; track f) {
          <button (click)="activeFilter.set(f)"
            [class]="activeFilter() === f ? activeFilterClass(f) : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'"
            class="rounded-lg px-4 py-2 text-sm font-medium transition">
            {{ f }}
          </button>
        }
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">User</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Reference</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Note</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filteredPayments(); track p.id) {
              <tr class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td class="p-4 font-medium">{{ userName(p.userId) }}</td>
                <td class="p-4 font-semibold">PKR {{ p.amount | number }}</td>
                <td class="p-4 text-slate-500">{{ p.referenceNumber || '—' }}</td>
                <td class="p-4 text-slate-500 max-w-32 truncate">{{ p.adminNote || '—' }}</td>
                <td class="p-4 text-slate-500">{{ p.createdAt | date:'MMM dd, yyyy' }}</td>
                <td class="p-4"><app-payment-chip [status]="p.status" /></td>
                <td class="p-4">
                  @if (p.status === 'Pending') {
                    <div class="flex items-center gap-2">
                      <button (click)="approve(p)" [disabled]="processingId() === p.id"
                        class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400 transition">
                        {{ processingId() === p.id ? '✓ Approving...' : 'Approve' }}
                      </button>
                      <button (click)="reject(p)" [disabled]="processingId() === p.id"
                        class="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:bg-red-50 dark:bg-red-900/30 dark:text-red-400 dark:disabled:bg-red-900/10 transition">
                        {{ processingId() === p.id ? '✗ Rejecting...' : 'Reject' }}
                      </button>
                    </div>
                  }
                </td>
              </tr>
            }
            @if (filteredPayments().length === 0) {
              <tr><td colspan="7" class="p-10 text-center text-slate-400">No payments found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class PaymentsComponent {
  readonly data = inject(AdminDataService);
  private readonly toast = inject(ToastService);

  filters = ['All', 'Pending', 'Approved', 'Rejected', 'Late'];
  activeFilter = signal('All');
  processingId = signal<string | null>(null);

  filteredPayments = computed(() => {
    const f = this.activeFilter();
    return f === 'All' ? this.data.payments() : this.data.payments().filter(p => p.status === f);
  });

  approve(p: Payment) {
    this.processingId.set(p.id);
    setTimeout(() => {
      this.data.approvePayment(p);
      this.toast.show(`✓ Payment of PKR ${p.amount} approved`, 'success');
      this.processingId.set(null);
    }, 600);
  }

  reject(p: Payment) {
    this.processingId.set(p.id);
    setTimeout(() => {
      this.data.rejectPayment(p);
      this.toast.show(`✗ Payment rejected`, 'warning');
      this.processingId.set(null);
    }, 600);
  }

  count(status: string): number { return this.data.payments().filter(p => p.status === status).length; }
  userName(id: string): string { return this.data.users().find(u => u.id === id)?.name ?? id; }

  activeFilterClass(f: string): string {
    const m: Record<string, string> = { All: 'bg-brand-600 text-white', Pending: 'bg-amber-500 text-white', Approved: 'bg-emerald-600 text-white', Rejected: 'bg-red-600 text-white', Late: 'bg-orange-500 text-white' };
    return m[f] || 'bg-brand-600 text-white';
  }
}

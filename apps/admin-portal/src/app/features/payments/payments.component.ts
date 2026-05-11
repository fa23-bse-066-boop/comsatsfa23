import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-white">Payment Approvals</h1>
          <span class="text-slate-400 text-sm">{{ data.pendingPayments() }} pending</span>
        </div>

        <!-- Filter -->
        <div class="flex gap-2 mb-6">
          @for (s of statuses; track s) {
            <button (click)="filter.set(s)"
              [class]="filter() === s ? activeFilterClass(s) : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">
              {{ s }}
            </button>
          }
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Reference</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Note</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredPayments(); track p.id) {
                <tr class="border-t border-slate-800 hover:bg-slate-800/40">
                  <td class="px-5 py-4 text-sm text-white">{{ getUserName(p.userId) }}</td>
                  <td class="px-5 py-4 text-sm font-semibold text-white">PKR {{ p.amount | number }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400">{{ p.referenceNumber || '—' }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400 max-w-32 truncate">{{ p.adminNote || '—' }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400">{{ p.createdAt | date:'MMM dd, yyyy' }}</td>
                  <td class="px-5 py-4">
                    <span [class]="statusClass(p.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ p.status }}</span>
                  </td>
                  <td class="px-5 py-4">
                    @if (p.status === 'Pending') {
                      <div class="flex items-center gap-3">
                        <button (click)="approve(p.id)" class="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Approve</button>
                        <button (click)="reject(p.id)" class="text-red-400 hover:text-red-300 text-sm font-medium">Reject</button>
                      </div>
                    }
                  </td>
                </tr>
              }
              @if (filteredPayments().length === 0) {
                <tr><td colspan="7" class="px-5 py-10 text-center text-slate-500">No payments found</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </app-admin-layout>
  `,
})
export class AdminPaymentsComponent {
  data = inject(DataService);
  private toast = inject(ToastService);

  statuses = ['All', 'Pending', 'Approved', 'Rejected'];
  filter = signal('All');

  filteredPayments = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.data.payments() : this.data.payments().filter(p => p.status === f);
  });

  approve(id: string) {
    this.data.approvePayment(id);
    this.toast.show('Payment approved', 'success');
  }

  reject(id: string) {
    this.data.rejectPayment(id);
    this.toast.show('Payment rejected', 'info');
  }

  getUserName(userId: string): string {
    return this.data.users().find(u => u.id === userId)?.name || userId;
  }

  activeFilterClass(s: string): string {
    const m: Record<string, string> = {
      All: 'bg-blue-600 text-white',
      Pending: 'bg-amber-600 text-white',
      Approved: 'bg-emerald-600 text-white',
      Rejected: 'bg-red-600 text-white',
    };
    return m[s] || 'bg-blue-600 text-white';
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Pending: 'bg-amber-900/30 text-amber-400',
      Approved: 'bg-emerald-900/30 text-emerald-400',
      Rejected: 'bg-red-900/30 text-red-400',
      Late: 'bg-orange-900/30 text-orange-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }
}

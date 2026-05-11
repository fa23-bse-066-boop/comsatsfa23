import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';
import { ToastService } from '../../core/services/toast.service';
import { DataService } from '../../core/services/data.service';
import { MOCK_PAYOUTS, PayoutStatus } from '@dcms/shared-types';
import { Payout } from '@dcms/shared-types';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-white">Payout Management</h1>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Committee</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Position</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Scheduled</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (payout of payouts(); track payout.id) {
                <tr class="border-t border-slate-800 hover:bg-slate-800/40">
                  <td class="px-5 py-4 text-sm text-white">{{ getUserName(payout.userId) }}</td>
                  <td class="px-5 py-4 text-sm text-slate-300">{{ getCommitteeName(payout.committeeId) }}</td>
                  <td class="px-5 py-4 text-sm font-semibold text-white">PKR {{ payout.amount | number }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400">#{{ payout.position }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400">{{ payout.scheduledDate | date:'MMM dd, yyyy' }}</td>
                  <td class="px-5 py-4">
                    <span [class]="statusClass(payout.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ payout.status }}</span>
                  </td>
                  <td class="px-5 py-4">
                    @if (payout.status === 'Scheduled') {
                      <div class="flex items-center gap-3">
                        <button (click)="release(payout)" class="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Release</button>
                        <button (click)="hold(payout)" class="text-amber-400 hover:text-amber-300 text-sm font-medium">Hold</button>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </app-admin-layout>
  `,
})
export class PayoutsComponent {
  data = inject(DataService);
  private toast = inject(ToastService);

  payouts = signal<Payout[]>([...MOCK_PAYOUTS]);

  release(payout: Payout) {
    this.payouts.update(list =>
      list.map(p => p.id === payout.id ? { ...p, status: PayoutStatus.Released, releasedDate: new Date().toISOString() } : p)
    );
    this.toast.show('Payout released successfully', 'success');
  }

  hold(payout: Payout) {
    this.payouts.update(list =>
      list.map(p => p.id === payout.id ? { ...p, status: PayoutStatus.Held } : p)
    );
    this.toast.show('Payout placed on hold', 'info');
  }

  getUserName(userId: string): string {
    return this.data.users().find(u => u.id === userId)?.name || userId;
  }

  getCommitteeName(committeeId: string): string {
    return this.data.committees().find(c => c.id === committeeId)?.name || committeeId;
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Scheduled: 'bg-blue-900/30 text-blue-400',
      Released: 'bg-emerald-900/30 text-emerald-400',
      Held: 'bg-amber-900/30 text-amber-400',
      Completed: 'bg-slate-700 text-slate-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }
}

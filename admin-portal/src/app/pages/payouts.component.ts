import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../core/admin-data.service';
import { Payout } from '@dcms/shared-types';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-5">
      <h1 class="text-3xl font-bold">Payouts</h1>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">User</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Committee</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Position</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Scheduled</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (payout of data.payouts(); track payout.id) {
              <tr class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td class="p-4 font-medium">{{ userName(payout.userId) }}</td>
                <td class="p-4 text-slate-600 dark:text-slate-300">{{ committeeName(payout.committeeId) }}</td>
                <td class="p-4 font-semibold">PKR {{ payout.amount | number }}</td>
                <td class="p-4 text-slate-500">#{{ payout.position }}</td>
                <td class="p-4 text-slate-500">{{ payout.scheduledDate | date:'MMM dd, yyyy' }}</td>
                <td class="p-4">
                  <span [class]="statusClass(payout.status)" class="rounded-full px-2 py-0.5 text-xs font-medium">{{ payout.status }}</span>
                </td>
                <td class="p-4">
                  @if (payout.status === 'Scheduled') {
                    <div class="flex items-center gap-3">
                      <button (click)="release(payout)"
                        class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
                        Release
                      </button>
                      <button (click)="hold(payout)"
                        class="rounded-md bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 transition">
                        Hold
                      </button>
                    </div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class PayoutsComponent {
  readonly data = inject(AdminDataService);

  release(p: Payout) { this.data.releasePayout(p.id); }
  hold(p: Payout) { this.data.holdPayout(p.id); }

  userName(id: string): string { return this.data.users().find(u => u.id === id)?.name ?? id; }
  committeeName(id: string): string { return this.data.committees().find(c => c.id === id)?.name ?? id; }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Released: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Held: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
    return m[status] || 'bg-slate-100 text-slate-600';
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-join-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Join Requests</h1>
          <p class="text-slate-500">{{ data.pendingJoinRequests() }} pending approval</p>
        </div>
        <div class="flex gap-2">
          @for (f of filters; track f) {
            <button (click)="activeFilter.set(f)"
              [class]="activeFilter() === f ? activeFilterClass(f) : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'"
              class="rounded-lg px-4 py-2 text-sm font-medium transition">
              {{ f }}
            </button>
          }
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">User</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Committee</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Requested</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Risk</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (req of filteredRequests(); track req.id) {
              <tr class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td class="p-4 font-medium">{{ userName(req.userId) }}</td>
                <td class="p-4 text-slate-600 dark:text-slate-300">{{ committeeName(req.committeeId) }}</td>
                <td class="p-4 text-slate-500">{{ req.requestedAt | date:'MMM dd, yyyy' }}</td>
                <td class="p-4">
                  @if (req.riskFlag) {
                    <span class="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">⚠ {{ req.riskReason || 'Risk' }}</span>
                  } @else {
                    <span class="text-slate-400 text-xs">Clear</span>
                  }
                </td>
                <td class="p-4">
                  <span [class]="statusClass(req.status)" class="rounded-full px-2 py-0.5 text-xs font-medium">{{ req.status }}</span>
                </td>
                <td class="p-4">
                  @if (req.status === 'Pending') {
                    <div class="flex items-center gap-3">
                      <button (click)="approve(req.id)"
                        class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
                        Approve
                      </button>
                      <button (click)="reject(req.id)"
                        class="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition">
                        Reject
                      </button>
                    </div>
                  }
                </td>
              </tr>
            }
            @if (filteredRequests().length === 0) {
              <tr><td colspan="6" class="p-10 text-center text-slate-400">No requests found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class JoinRequestsComponent {
  readonly data = inject(AdminDataService);

  filters = ['All', 'Pending', 'Approved', 'Rejected'];
  activeFilter = signal('All');

  filteredRequests = computed(() => {
    const f = this.activeFilter();
    const all = this.data.joinRequests() as any[];
    return f === 'All' ? all : all.filter((r: any) => r.status === f);
  });

  approve(id: string) { this.data.approveJoinRequest(id); }
  reject(id: string) { this.data.rejectJoinRequest(id); }

  userName(id: string): string { return this.data.users().find(u => u.id === id)?.name ?? id; }
  committeeName(id: string): string { return this.data.committees().find(c => c.id === id)?.name ?? id; }

  activeFilterClass(f: string): string {
    const m: Record<string, string> = { All: 'bg-brand-600 text-white', Pending: 'bg-amber-500 text-white', Approved: 'bg-emerald-600 text-white', Rejected: 'bg-red-600 text-white' };
    return m[f] || 'bg-brand-600 text-white';
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Waitlisted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return m[status] || 'bg-slate-100 text-slate-600';
  }
}

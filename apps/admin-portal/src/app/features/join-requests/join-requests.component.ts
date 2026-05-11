import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-join-requests',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-white">Join Requests</h1>
          <div class="flex gap-2">
            <button (click)="filter.set('All')" [class]="filter() === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">All</button>
            <button (click)="filter.set('Pending')" [class]="filter() === 'Pending' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">Pending ({{ data.pendingJoinRequests() }})</button>
            <button (click)="filter.set('Approved')" [class]="filter() === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">Approved</button>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Committee</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Requested</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Risk</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (req of filteredRequests(); track req.id) {
                <tr class="border-t border-slate-800 hover:bg-slate-800/40">
                  <td class="px-5 py-4 text-sm text-white">{{ getUserName(req.userId) }}</td>
                  <td class="px-5 py-4 text-sm text-slate-300">{{ getCommitteeName(req.committeeId) }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400">{{ req.requestedAt | date:'MMM dd, yyyy' }}</td>
                  <td class="px-5 py-4">
                    @if (req.riskFlag) {
                      <span class="text-xs bg-orange-900/30 text-orange-400 px-2 py-1 rounded-full">⚠ {{ req.riskReason || 'Risk' }}</span>
                    } @else {
                      <span class="text-slate-600 text-xs">—</span>
                    }
                  </td>
                  <td class="px-5 py-4">
                    <span [class]="statusClass(req.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ req.status }}</span>
                  </td>
                  <td class="px-5 py-4">
                    @if (req.status === 'Pending') {
                      <div class="flex items-center gap-3">
                        <button (click)="approve(req.id)" class="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Approve</button>
                        <button (click)="reject(req.id)" class="text-red-400 hover:text-red-300 text-sm font-medium">Reject</button>
                      </div>
                    }
                  </td>
                </tr>
              }
              @if (filteredRequests().length === 0) {
                <tr><td colspan="6" class="px-5 py-10 text-center text-slate-500">No requests found</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </app-admin-layout>
  `,
})
export class JoinRequestsComponent {
  data = inject(DataService);
  private toast = inject(ToastService);

  filter = signal('All');

  filteredRequests = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.data.joinRequests() : this.data.joinRequests().filter(r => r.status === f);
  });

  approve(id: string) {
    this.data.approveJoinRequest(id);
    this.toast.show('Join request approved — member count updated', 'success');
  }

  reject(id: string) {
    this.data.rejectJoinRequest(id);
    this.toast.show('Join request rejected', 'info');
  }

  getUserName(userId: string): string {
    return this.data.users().find(u => u.id === userId)?.name || userId;
  }

  getCommitteeName(committeeId: string): string {
    return this.data.committees().find(c => c.id === committeeId)?.name || committeeId;
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Pending: 'bg-amber-900/30 text-amber-400',
      Approved: 'bg-emerald-900/30 text-emerald-400',
      Rejected: 'bg-red-900/30 text-red-400',
      Waitlisted: 'bg-blue-900/30 text-blue-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }
}

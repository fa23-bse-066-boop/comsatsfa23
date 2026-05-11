import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentChipComponent, StatsCardComponent } from '@dcms/shared-ui';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, PaymentChipComponent],
  template: `
    <section class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <app-stats-card label="Total Users"       [value]="data.totalUsers()"          icon="👥" />
        <app-stats-card label="Committees"        [value]="data.totalCommittees()"     icon="🏦" />
        <app-stats-card label="Active"            [value]="data.activeCommittees()"    icon="✅" tone="success" />
        <app-stats-card label="Join Requests"     [value]="data.pendingJoinRequests()" icon="📋" tone="danger" />
        <app-stats-card label="Pending Payments"  [value]="data.pendingPayments()"     icon="💳" tone="danger" />
      </div>

      <!-- Quick Actions -->
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <h2 class="mb-4 font-semibold">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <a routerLink="/committees" class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">🏦 Committees</a>
          <a routerLink="/users"      class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">👥 Users</a>
          <a routerLink="/payments"   class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">💳 Payments</a>
          <a routerLink="/join-requests" class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">📋 Join Requests</a>
        </div>
      </div>

      <!-- Recent data -->
      <div class="grid gap-6 xl:grid-cols-2">
        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-semibold">Recent Committees</h2>
            <a routerLink="/committees" class="text-sm font-semibold text-brand-600">View all →</a>
          </div>
          @for (c of data.committees().slice(0, 5); track c.id) {
            <div class="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0 dark:border-slate-800">
              <div>
                <p class="font-medium">{{ c.name }}</p>
                <p class="text-xs text-slate-500">PKR {{ c.monthlyAmount | number }} · {{ c.currentMembers }}/{{ c.totalMembers }} members</p>
              </div>
              <span [class]="statusClass(c.status)" class="rounded-full px-2 py-0.5 text-xs font-medium">{{ c.status }}</span>
            </div>
          }
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-semibold">Recent Payments</h2>
            <a routerLink="/payments" class="text-sm font-semibold text-brand-600">View all →</a>
          </div>
          @for (p of data.payments().slice(0, 5); track p.id) {
            <div class="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0 dark:border-slate-800">
              <div>
                <p class="font-medium">PKR {{ p.amount | number }}</p>
                <p class="text-xs text-slate-500">{{ p.createdAt | date:'MMM dd, yyyy' }}</p>
              </div>
              <app-payment-chip [status]="p.status" />
            </div>
          }
        </section>
      </div>
    </section>
  `,
})
export class AdminDashboardComponent {
  readonly data = inject(AdminDataService);

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Closed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return m[status] || 'bg-slate-100 text-slate-600';
  }
}

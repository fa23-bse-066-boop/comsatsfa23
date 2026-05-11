import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { DataService } from '../../core/services/data.service';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white">Dashboard</h1>
          <p class="text-slate-400 mt-1">Welcome back, {{ auth.currentAdmin()?.name }}</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Total Users</p>
            <p class="text-3xl font-bold text-white mt-2">{{ data.totalUsers() }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Committees</p>
            <p class="text-3xl font-bold text-white mt-2">{{ data.totalCommittees() }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Active</p>
            <p class="text-3xl font-bold text-emerald-400 mt-2">{{ data.activeCommittees() }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Join Requests</p>
            <p class="text-3xl font-bold text-amber-400 mt-2">{{ data.pendingJoinRequests() }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Pending Payments</p>
            <p class="text-3xl font-bold text-blue-400 mt-2">{{ data.pendingPayments() }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button (click)="nav('/committees')" class="p-4 bg-slate-800 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-600 rounded-lg transition text-white text-sm font-medium">
              🏦 Committees
            </button>
            <button (click)="nav('/users')" class="p-4 bg-slate-800 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-600 rounded-lg transition text-white text-sm font-medium">
              👥 Users
            </button>
            <button (click)="nav('/payments')" class="p-4 bg-slate-800 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-600 rounded-lg transition text-white text-sm font-medium">
              💳 Payments
            </button>
            <button (click)="nav('/join-requests')" class="p-4 bg-slate-800 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-600 rounded-lg transition text-white text-sm font-medium">
              📋 Join Requests
            </button>
          </div>
        </div>

        <!-- Recent data -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Committees -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">Recent Committees</h2>
              <button (click)="nav('/committees')" class="text-blue-400 hover:text-blue-300 text-sm">View All →</button>
            </div>
            <div class="space-y-3">
              @for (c of data.committees().slice(0, 4); track c.id) {
                <div class="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p class="text-sm font-medium text-white">{{ c.name }}</p>
                    <p class="text-xs text-slate-400">PKR {{ c.monthlyAmount | number }} / month</p>
                  </div>
                  <span [class]="statusClass(c.status)" class="text-xs px-2 py-1 rounded-full">{{ c.status }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Recent Payments -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">Recent Payments</h2>
              <button (click)="nav('/payments')" class="text-blue-400 hover:text-blue-300 text-sm">View All →</button>
            </div>
            <div class="space-y-3">
              @for (p of data.payments().slice(0, 4); track p.id) {
                <div class="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p class="text-sm font-medium text-white">PKR {{ p.amount | number }}</p>
                    <p class="text-xs text-slate-400">{{ p.createdAt | date:'MMM dd, yyyy' }}</p>
                  </div>
                  <span [class]="paymentStatusClass(p.status)" class="text-xs px-2 py-1 rounded-full">{{ p.status }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
})
export class AdminDashboardComponent {
  auth = inject(AdminAuthService);
  data = inject(DataService);
  private router = inject(Router);

  nav(path: string) { this.router.navigate([path]); }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-900/30 text-emerald-400',
      Paused: 'bg-amber-900/30 text-amber-400',
      Closed: 'bg-red-900/30 text-red-400',
      Draft: 'bg-slate-700 text-slate-400',
      Completed: 'bg-blue-900/30 text-blue-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }

  paymentStatusClass(status: string): string {
    const m: Record<string, string> = {
      Pending: 'bg-amber-900/30 text-amber-400',
      Approved: 'bg-emerald-900/30 text-emerald-400',
      Rejected: 'bg-red-900/30 text-red-400',
      Late: 'bg-orange-900/30 text-orange-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }
}

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/services/data.service';
import { UserLayoutComponent } from '../../core/components/user-layout.component';
import { PaymentStatus } from '@dcms/shared-types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {{ auth.currentUser()?.name }}</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">My Committees</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ myCommittees().length }}</p>
            <button (click)="nav('/my-committees')" class="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">View All →</button>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pending Payments</p>
            <p class="text-3xl font-bold text-amber-500 mt-2">{{ pendingPayments().length }}</p>
            <button (click)="nav('/payments')" class="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">Pay Now →</button>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Paid</p>
            <p class="text-3xl font-bold text-emerald-500 mt-2">{{ approvedPayments().length }}</p>
            <button (click)="nav('/payments')" class="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">History →</button>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Trust Score</p>
            <p class="text-3xl font-bold text-purple-500 mt-2">{{ auth.currentUser()?.trustScore || 0 }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button (click)="nav('/payments')" class="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl transition">
              <p class="text-blue-600 dark:text-blue-400 font-semibold text-sm">💳 Submit Payment</p>
            </button>
            <button (click)="nav('/committees')" class="p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-xl transition">
              <p class="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">🔍 Browse Committees</p>
            </button>
            <button (click)="nav('/my-committees')" class="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-xl transition">
              <p class="text-purple-600 dark:text-purple-400 font-semibold text-sm">📊 My Committees</p>
            </button>
            <button (click)="nav('/wallet')" class="p-4 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-xl transition">
              <p class="text-amber-600 dark:text-amber-400 font-semibold text-sm">💰 Wallet</p>
            </button>
          </div>
        </div>

        <!-- Recent Payments -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Payments</h2>
            <button (click)="nav('/payments')" class="text-blue-600 dark:text-blue-400 text-sm font-medium">View All →</button>
          </div>
          @if (myPayments().length > 0) {
            <div class="space-y-3">
              @for (p of myPayments().slice(0, 5); track p.id) {
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-white">PKR {{ p.amount | number }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ p.createdAt | date:'MMM dd, yyyy' }}</p>
                  </div>
                  <span [class]="statusClass(p.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ p.status }}</span>
                </div>
              }
            </div>
          } @else {
            <p class="text-slate-500 dark:text-slate-400 text-sm">No payments yet. <button (click)="nav('/payments')" class="text-blue-600 dark:text-blue-400 font-medium">Submit one →</button></p>
          }
        </div>
      </div>
    </app-user-layout>
  `,
})
export class DashboardComponent {
  auth = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);

  myPayments = computed(() => {
    const uid = this.auth.currentUser()?.id;
    return uid ? this.dataService.getPaymentsForUser(uid) : [];
  });

  myCommittees = computed(() => {
    const uid = this.auth.currentUser()?.id;
    return uid ? this.dataService.getMyCommittees(uid) : [];
  });

  pendingPayments = computed(() => this.myPayments().filter(p => p.status === PaymentStatus.Pending));
  approvedPayments = computed(() => this.myPayments().filter(p => p.status === PaymentStatus.Approved));

  nav(path: string) { this.router.navigate([path]); }

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

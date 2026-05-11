import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AmountDisplayComponent, PaymentChipComponent, StatsCardComponent, TrustBadgeComponent } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';
import { PaymentStatus } from '@dcms/shared-types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, AmountDisplayComponent, TrustBadgeComponent, PaymentChipComponent],
  template: `
    <section class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <app-stats-card label="Wallet Balance"     [value]="data.currentUser().walletBalance" icon="PKR" [currency]="true" tone="success" />
        <app-stats-card label="My Committees"      [value]="data.myCommittees().length"        icon="🏦" />
        <app-stats-card label="Pending Payments"   [value]="pendingCount"                      icon="⏳" tone="danger" />
        <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p class="text-sm text-slate-500">Trust Score</p>
          <p class="mt-2 font-mono text-3xl font-semibold">{{ data.currentUser().trustScore }} / 1000</p>
          <div class="mt-3"><app-trust-badge [level]="data.currentUser().trustLevel" [score]="data.currentUser().trustScore" /></div>
        </article>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <h2 class="mb-4 font-semibold">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <a routerLink="/payment"       class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">💳 Pay Now</a>
          <a routerLink="/committees"    class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">🔍 Browse</a>
          <a routerLink="/my-committees" class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">📊 My Committees</a>
          <a routerLink="/wallet"        class="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">💰 Wallet</a>
        </div>
      </div>

      <!-- Recent data -->
      <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <!-- My Committees -->
        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">My Committees</h2>
            <a routerLink="/my-committees" class="text-sm font-semibold text-brand-600">View all →</a>
          </div>
          @if (data.myCommittees().length > 0) {
            <div class="space-y-4">
              @for (committee of data.myCommittees().slice(0, 3); track committee.id) {
                <div class="rounded-md border border-slate-100 p-4 dark:border-slate-800">
                  <div class="flex justify-between gap-4">
                    <div>
                      <h3 class="font-semibold">{{ committee.name }}</h3>
                      <p class="text-sm text-slate-500">{{ committee.currentMembers }}/{{ committee.totalMembers }} members</p>
                    </div>
                    <app-amount-display [amount]="committee.monthlyAmount" />
                  </div>
                  <div class="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                    <div class="h-2 rounded-full bg-brand-600" [style.width.%]="committee.currentMembers / committee.totalMembers * 100"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-slate-500">No committees yet. <a routerLink="/committees" class="font-semibold text-brand-600">Browse →</a></p>
          }
        </section>

        <!-- Recent Payments -->
        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">Recent Payments</h2>
            <a routerLink="/payment" class="text-sm font-semibold text-brand-600">View all →</a>
          </div>
          @if (data.myPayments().length > 0) {
            <div class="space-y-3">
              @for (payment of data.myPayments().slice(0, 5); track payment.id) {
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
                  <div>
                    <p class="font-medium">PKR {{ payment.amount | number }}</p>
                    <p class="text-sm text-slate-500">{{ payment.createdAt | date: 'mediumDate' }}</p>
                  </div>
                  <app-payment-chip [status]="payment.status" />
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-slate-500">No payments yet. <a routerLink="/payment" class="font-semibold text-brand-600">Submit one →</a></p>
          }
        </section>
      </div>
    </section>
  `,
})
export class DashboardComponent {
  readonly data = inject(UserDataService);

  get pendingCount(): number {
    return this.data.myPayments().filter(p => p.status === PaymentStatus.Pending).length;
  }
}

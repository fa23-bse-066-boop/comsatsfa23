import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserLayoutComponent } from '../../core/components/user-layout.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Wallet</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Your balance and transactions</p>
        </div>

        <!-- Balance Card -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-8">
          <p class="text-sm font-medium opacity-80">Available Balance</p>
          <h2 class="text-4xl font-bold mt-2">PKR {{ auth.currentUser()?.walletBalance | number }}</h2>
          <p class="text-sm opacity-70 mt-2">{{ auth.currentUser()?.name }}</p>
        </div>

        <!-- Info -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Info</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Trust Score</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ auth.currentUser()?.trustScore }}</p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Trust Level</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ auth.currentUser()?.trustLevel }}</p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Active Committees</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ auth.currentUser()?.activeCommittees }}</p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Total Paid</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">PKR {{ auth.currentUser()?.totalPaid | number }}</p>
            </div>
          </div>
        </div>
      </div>
    </app-user-layout>
  `,
})
export class WalletComponent {
  auth = inject(AuthService);
  private router = inject(Router);
}

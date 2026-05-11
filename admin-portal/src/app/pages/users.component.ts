import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserStatus } from '@dcms/shared-types';
import { AvatarComponent, TrustBadgeComponent } from '@dcms/shared-ui';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, AvatarComponent, TrustBadgeComponent],
  template: `
    <section class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Users</h1>
          <p class="text-slate-500">{{ data.totalUsers() }} users registered</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">User</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">KYC</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Trust</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Risk</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of nonAdminUsers(); track user.id) {
              <tr class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <app-avatar [name]="user.name" [src]="user.avatar || ''" />
                    <div>
                      <p class="font-medium">{{ user.name }}</p>
                      <p class="text-xs text-slate-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span [class]="kycClass(user.kycStatus)" class="rounded-full px-2 py-0.5 text-xs font-medium">{{ user.kycStatus }}</span>
                </td>
                <td class="p-4">
                  <app-trust-badge [level]="user.trustLevel" [score]="user.trustScore" size="sm" />
                </td>
                <td class="p-4">
                  <span [class]="statusClass(user.status)" class="rounded-full px-2 py-0.5 text-xs font-medium">{{ user.status }}</span>
                </td>
                <td class="p-4">
                  @if (user.riskFlag) {
                    <span class="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">⚠ Risk</span>
                  } @else {
                    <span class="text-slate-400 text-xs">—</span>
                  }
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    @if (user.status === UserStatus.Suspended) {
                      <button (click)="activate(user)" class="text-sm font-medium text-emerald-600 hover:text-emerald-700">Activate</button>
                    } @else {
                      <button (click)="suspend(user)" class="text-sm font-medium text-amber-600 hover:text-amber-700">Suspend</button>
                    }
                    <button (click)="confirmDelete(user)" class="text-sm font-medium text-red-500 hover:text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    <!-- Delete Confirm -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-modal dark:border-slate-700 dark:bg-slate-900">
          <h2 class="text-lg font-bold">Delete User</h2>
          <p class="mt-2 text-slate-500">Delete <strong class="text-slate-900 dark:text-white">{{ deleteTarget()!.name }}</strong>? This cannot be undone.</p>
          <div class="mt-6 flex gap-3">
            <button (click)="deleteTarget.set(null)" class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 transition">Cancel</button>
            <button (click)="doDelete()" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UsersComponent {
  readonly data = inject(AdminDataService);
  readonly UserStatus = UserStatus;
  deleteTarget = signal<User | null>(null);

  nonAdminUsers() {
    return this.data.users().filter(u => u.id !== 'usr_admin_001');
  }

  suspend(user: User) { this.data.updateUserStatus(user.id, UserStatus.Suspended); }
  activate(user: User) { this.data.updateUserStatus(user.id, UserStatus.Active); }
  confirmDelete(user: User) { this.deleteTarget.set(user); }
  doDelete() {
    if (this.deleteTarget()) {
      this.data.deleteUser(this.deleteTarget()!.id);
      this.deleteTarget.set(null);
    }
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Banned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return m[status] || 'bg-slate-100 text-slate-600';
  }

  kycClass(status: string): string {
    const m: Record<string, string> = {
      Verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      UnderReview: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      NotSubmitted: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
    return m[status] || 'bg-slate-100 text-slate-600';
  }
}

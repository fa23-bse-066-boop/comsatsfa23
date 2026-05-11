import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';
import { ToastService } from '../../core/services/toast.service';
import { User, UserStatus } from '@dcms/shared-types';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-white">Users Management</h1>
          <span class="text-slate-400 text-sm">{{ data.totalUsers() }} users</span>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Trust Score</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">KYC</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of nonAdminUsers(); track user.id) {
                <tr class="border-t border-slate-800 hover:bg-slate-800/40">
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {{ user.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-white">{{ user.name }}</p>
                        @if (user.riskFlag) {
                          <span class="text-xs text-orange-400">⚠ Risk</span>
                        }
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-sm text-slate-400">{{ user.email }}</td>
                  <td class="px-5 py-4 text-sm text-white">{{ user.trustScore }}/1000</td>
                  <td class="px-5 py-4">
                    <span [class]="kycClass(user.kycStatus)" class="text-xs px-2 py-1 rounded-full">{{ user.kycStatus }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <span [class]="statusClass(user.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ user.status }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      @if (user.status === UserStatus.Suspended) {
                        <button (click)="activateUser(user)" class="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Activate</button>
                      } @else {
                        <button (click)="suspendUser(user)" class="text-amber-400 hover:text-amber-300 text-sm font-medium">Suspend</button>
                      }
                      <button (click)="confirmDelete(user)" class="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Delete Confirm -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm p-6">
            <h2 class="text-lg font-bold text-white mb-2">Delete User</h2>
            <p class="text-slate-400 mb-6">Delete <span class="text-white font-medium">{{ deleteTarget()!.name }}</span>? This cannot be undone.</p>
            <div class="flex gap-3">
              <button (click)="deleteTarget.set(null)" class="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">Cancel</button>
              <button (click)="doDelete()" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">Delete</button>
            </div>
          </div>
        </div>
      }
    </app-admin-layout>
  `,
})
export class UsersComponent {
  data = inject(DataService);
  private toast = inject(ToastService);

  UserStatus = UserStatus;
  deleteTarget = signal<User | null>(null);

  nonAdminUsers() {
    return this.data.users().filter(u => u.id !== 'usr_admin_001');
  }

  suspendUser(user: User) {
    this.data.updateUserStatus(user.id, UserStatus.Suspended);
    this.toast.show(`${user.name} suspended`, 'info');
  }

  activateUser(user: User) {
    this.data.updateUserStatus(user.id, UserStatus.Active);
    this.toast.show(`${user.name} activated`, 'success');
  }

  confirmDelete(user: User) { this.deleteTarget.set(user); }

  doDelete() {
    if (this.deleteTarget()) {
      this.data.deleteUser(this.deleteTarget()!.id);
      this.toast.show('User deleted', 'error');
      this.deleteTarget.set(null);
    }
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-900/30 text-emerald-400',
      Suspended: 'bg-amber-900/30 text-amber-400',
      Banned: 'bg-red-900/30 text-red-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }

  kycClass(status: string): string {
    const m: Record<string, string> = {
      Verified: 'bg-emerald-900/30 text-emerald-400',
      Submitted: 'bg-blue-900/30 text-blue-400',
      UnderReview: 'bg-amber-900/30 text-amber-400',
      Rejected: 'bg-red-900/30 text-red-400',
      NotSubmitted: 'bg-slate-700 text-slate-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }
}

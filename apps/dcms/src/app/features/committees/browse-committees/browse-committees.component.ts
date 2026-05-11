import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { DataService } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserLayoutComponent } from '../../../core/components/user-layout.component';
import { Committee, CommitteeStatus } from '@dcms/shared-types';

@Component({
  selector: 'app-browse-committees',
  standalone: true,
  imports: [CommonModule, FormsModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Browse Committees</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Find and join a committee</p>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <input [(ngModel)]="search" type="text" placeholder="Search committees..."
            class="w-full max-w-md px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (c of filteredCommittees(); track c.id) {
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 transition">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">{{ c.name }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ c.type }}</p>
                </div>
                <span [class]="statusClass(c.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ c.status }}</span>
              </div>

              @if (c.description) {
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{{ c.description }}</p>
              }

              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Monthly</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">PKR {{ c.monthlyAmount | number }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Members</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ c.currentMembers }}/{{ c.totalMembers }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ c.duration }} months</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Start</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ c.startDate | date:'MMM yyyy' }}</p>
                </div>
              </div>

              @if (c.status === 'Active' && c.currentMembers < c.totalMembers) {
                @if (joinStatus(c.id) === 'Approved') {
                  <div class="w-full py-2.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium text-center">
                    ✓ Member
                  </div>
                } @else if (joinStatus(c.id) === 'Pending') {
                  <div class="w-full py-2.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium text-center">
                    ⏳ Request Pending
                  </div>
                } @else if (joinStatus(c.id) === 'Rejected') {
                  <div class="w-full py-2.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium text-center">
                    ✗ Request Rejected
                  </div>
                } @else {
                  <button (click)="joinCommittee(c)" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                    Request to Join
                  </button>
                }
              } @else if (c.currentMembers >= c.totalMembers) {
                <div class="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-sm font-medium text-center">
                  Committee Full
                </div>
              }
            </div>
          }
          @if (filteredCommittees().length === 0) {
            <div class="col-span-3 text-center py-12 text-slate-400">No committees found</div>
          }
        </div>
      </div>
    </app-user-layout>
  `,
})
export class BrowseCommitteesComponent {
  auth = inject(AuthService);
  private dataService = inject(DataService);
  private toast = inject(ToastService);
  private router = inject(Router);

  search = '';

  filteredCommittees = computed(() => {
    const s = this.search.toLowerCase();
    return this.dataService.committees().filter(c =>
      !s || c.name.toLowerCase().includes(s) || c.description?.toLowerCase().includes(s)
    );
  });

  joinStatus(committeeId: string): string | null {
    const uid = this.auth.currentUser()?.id;
    return uid ? this.dataService.getJoinStatus(uid, committeeId) : null;
  }

  joinCommittee(c: Committee) {
    const uid = this.auth.currentUser()?.id;
    if (!uid) return;
    const result = this.dataService.submitJoinRequest(uid, c.id);
    if (result) {
      this.toast.show(`Join request sent for "${c.name}" — awaiting admin approval`, 'success');
    } else {
      this.toast.show('You already have a request for this committee', 'info');
    }
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      Paused: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      Closed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      Completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return m[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  }
}

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { DataService } from '../../../core/services/data.service';
import { UserLayoutComponent } from '../../../core/components/user-layout.component';

@Component({
  selector: 'app-my-committees',
  standalone: true,
  imports: [CommonModule, UserLayoutComponent],
  template: `
    <app-user-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">My Committees</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Your active and completed committees</p>
        </div>

        @if (myCommittees().length > 0) {
          <div class="space-y-4">
            @for (c of myCommittees(); track c.id) {
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ c.name }}</h3>
                    @if (c.description) {
                      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ c.description }}</p>
                    }
                  </div>
                  <span [class]="statusClass(c.status)" class="text-xs px-3 py-1 rounded-full font-medium">{{ c.status }}</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Monthly</p>
                    <p class="text-base font-semibold text-slate-900 dark:text-white mt-1">PKR {{ c.monthlyAmount | number }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Duration</p>
                    <p class="text-base font-semibold text-slate-900 dark:text-white mt-1">{{ c.duration }} months</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Members</p>
                    <p class="text-base font-semibold text-slate-900 dark:text-white mt-1">{{ c.currentMembers }}/{{ c.totalMembers }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase">Progress</p>
                    <div class="mt-2 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full transition-all" [style.width.%]="(c.currentMembers / c.totalMembers) * 100"></div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button (click)="payNow()" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                    💳 Pay Now
                  </button>
                  <button (click)="browse()" class="px-5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    Browse More
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <p class="text-4xl mb-4">🏦</p>
            <p class="text-slate-500 dark:text-slate-400 text-lg mb-4">You haven't joined any committees yet</p>
            <button (click)="browse()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Browse Committees
            </button>
          </div>
        }
      </div>
    </app-user-layout>
  `,
})
export class MyCommitteesComponent {
  auth = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);

  myCommittees = computed(() => {
    const uid = this.auth.currentUser()?.id;
    return uid ? this.dataService.getMyCommittees(uid) : [];
  });

  payNow() { this.router.navigate(['/payments']); }
  browse() { this.router.navigate(['/committees']); }

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

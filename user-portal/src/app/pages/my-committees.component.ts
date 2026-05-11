import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Committee } from '@dcms/shared-types';
import { AmountDisplayComponent, DrawerComponent, PaymentChipComponent, StatusBadgeComponent } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-my-committees',
  standalone: true,
  imports: [CommonModule, RouterLink, AmountDisplayComponent, DrawerComponent, PaymentChipComponent, StatusBadgeComponent],
  template: `
    <section class="space-y-6">
      <h1 class="text-3xl font-bold">My Committees</h1>

      @if (data.myCommittees().length > 0) {
        <div class="space-y-4">
          @for (committee of data.myCommittees(); track committee.id) {
            <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
              <div class="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-lg font-semibold">{{ committee.name }}</h2>
                    <app-status-badge [label]="committee.status" [tone]="committee.status === 'Active' ? 'success' : 'warning'" />
                  </div>
                  <p class="mt-1 text-sm text-slate-500">
                    {{ committee.currentMembers }}/{{ committee.totalMembers }} members · {{ committee.duration }} months · PKR {{ committee.monthlyAmount | number }}/month
                  </p>
                </div>
                <app-amount-display [amount]="committee.monthlyAmount" />
              </div>
              <div class="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                <div class="h-2 rounded-full bg-brand-600 transition-all" [style.width.%]="(committee.currentMembers / committee.totalMembers) * 100"></div>
              </div>
              <div class="mt-5 flex flex-wrap gap-2">
                <button type="button"
                  class="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition"
                  (click)="selected.set(committee)">
                  View Details
                </button>
                <button type="button"
                  class="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
                  (click)="payNow()">
                  💳 Pay Now
                </button>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p class="text-4xl mb-4">🏦</p>
          <p class="text-lg font-semibold text-slate-700 dark:text-slate-300">No committees yet</p>
          <p class="mt-2 text-sm text-slate-500">Browse and join a committee to get started.</p>
          <a routerLink="/committees" class="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
            Browse Committees
          </a>
        </div>
      }
    </section>

    <app-drawer [isOpen]="selected() !== undefined" title="Committee details" (closed)="selected.set(undefined)">
      @if (selected(); as committee) {
        <div class="space-y-5">
          <h3 class="text-xl font-semibold">{{ committee.name }}</h3>
          @if (committee.description) {
            <p class="text-sm text-slate-500">{{ committee.description }}</p>
          }
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p class="text-xs text-slate-500 uppercase">Monthly</p>
              <p class="font-semibold mt-1">PKR {{ committee.monthlyAmount | number }}</p>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p class="text-xs text-slate-500 uppercase">Duration</p>
              <p class="font-semibold mt-1">{{ committee.duration }} months</p>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p class="text-xs text-slate-500 uppercase">Members</p>
              <p class="font-semibold mt-1">{{ committee.currentMembers }}/{{ committee.totalMembers }}</p>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p class="text-xs text-slate-500 uppercase">Type</p>
              <p class="font-semibold mt-1">{{ committee.type }}</p>
            </div>
          </div>
          <button type="button"
            class="w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 transition"
            (click)="payNow(); selected.set(undefined)">
            💳 Pay Now
          </button>
        </div>
      }
    </app-drawer>
  `,
})
export class MyCommitteesComponent {
  readonly data = inject(UserDataService);
  private readonly router = inject(Router);
  readonly selected = signal<Committee | undefined>(undefined);

  payNow() { this.router.navigate(['/payment']); }
}

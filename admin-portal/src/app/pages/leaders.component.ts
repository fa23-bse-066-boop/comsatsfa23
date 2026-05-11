import { Component, inject, signal } from '@angular/core';
import { DrawerComponent, AmountDisplayComponent } from '@dcms/shared-ui';
import { AdminDataService } from '../core/admin-data.service';

interface LeaderRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeCommittees: readonly string[];
  stats: { successRate: number; collectionsAmount: number; complaints: number };
  joinedAt: string;
}

@Component({
  selector: 'app-leaders',
  standalone: true,
  imports: [DrawerComponent, AmountDisplayComponent],
  template: `
    <section class="space-y-5">
      <h1 class="text-3xl font-bold">Leaders</h1>
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        @for (leader of data.leaders(); track leader.id) {
          <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <h2 class="text-lg font-semibold">{{ leader.name }}</h2>
            <p class="text-sm text-slate-500">{{ leader.email }}</p>
            <dl class="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt class="text-slate-500">Success</dt><dd class="font-mono font-semibold">{{ leader.stats.successRate }}%</dd></div><div><dt class="text-slate-500">Complaints</dt><dd class="font-mono font-semibold">{{ leader.stats.complaints }}</dd></div></dl>
            <div class="mt-4"><app-amount-display [amount]="leader.stats.collectionsAmount" /></div>
            <button class="mt-5 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold" (click)="selected.set(leader)">View report</button>
          </article>
        }
      </div>
    </section>
    <app-drawer [isOpen]="selected() !== undefined" title="Leader performance" (closed)="selected.set(undefined)">
      @if (selected(); as leader) {
        <div class="space-y-4"><h2 class="text-xl font-semibold">{{ leader.name }}</h2><p>{{ leader.phone }}</p><p>Committees managed: {{ leader.activeCommittees.length }}</p><div class="h-40 rounded-md bg-slate-50 p-4 text-sm text-slate-500">Monthly collections bar chart placeholder</div></div>
      }
    </app-drawer>
  `,
})
export class LeadersComponent {
  readonly data = inject(AdminDataService);
  readonly selected = signal<LeaderRow | undefined>(undefined);
}

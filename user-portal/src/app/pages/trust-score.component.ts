import { Component, inject } from '@angular/core';
import { ChartCardComponent, TrustBadgeComponent } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-trust-score',
  standalone: true,
  imports: [TrustBadgeComponent, ChartCardComponent],
  template: `
    <section class="space-y-6">
      <article class="rounded-lg bg-brand-950 p-8 text-white shadow-raised">
        <p class="text-blue-200">Trust Score</p>
        <div class="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p class="font-mono text-6xl font-semibold">{{ data.currentUser().trustScore }}</p>
            <p class="mt-2 text-blue-100">out of 1000</p>
          </div>
          <app-trust-badge [level]="data.currentUser().trustLevel" size="lg" />
        </div>
        <div class="mt-6 h-3 rounded-full bg-white/10"><div class="h-3 rounded-full bg-emerald-400" [style.width.%]="data.currentUser().trustScore / 10"></div></div>
      </article>
      <app-chart-card title="Score Factors" subtitle="Mock score model">
        <div class="grid gap-3 md:grid-cols-2">
          @for (factor of factors; track factor.label) {
            <div class="rounded-md border border-slate-100 p-4"><p class="font-semibold">{{ factor.label }}</p><p class="text-sm text-slate-500">{{ factor.points }} points</p></div>
          }
        </div>
      </app-chart-card>
    </section>
  `,
})
export class TrustScoreComponent {
  readonly data = inject(UserDataService);
  readonly factors = [
    { label: 'On-time payments', points: '+400' },
    { label: 'Completed committees', points: '+200' },
    { label: 'KYC verified', points: '+150' },
    { label: 'Profile completion', points: '+50' },
  ];
}

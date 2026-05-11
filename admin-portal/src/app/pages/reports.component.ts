import { Component, signal } from '@angular/core';
import { ChartCardComponent, StatsCardComponent } from '@dcms/shared-ui';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ChartCardComponent, StatsCardComponent],
  template: `
    <section class="grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside class="rounded-lg border border-slate-200 bg-white p-3 shadow-card">
        @for (report of reports; track report) { <button class="block w-full rounded-md px-3 py-2 text-left text-sm" [class.bg-brand-50]="active() === report" [class.text-brand-700]="active() === report" (click)="active.set(report)">{{ report }}</button> }
      </aside>
      <main class="space-y-5">
        <h1 class="text-3xl font-bold">{{ active() }}</h1>
        <div class="grid gap-4 md:grid-cols-3"><app-stats-card label="Collections" [value]="12400000" icon="C" [currency]="true" /><app-stats-card label="Revenue" [value]="186000" icon="R" [currency]="true" /><app-stats-card label="Risk Alerts" [value]="7" icon="F" /></div>
        <app-chart-card [title]="active()" subtitle="Exportable mock report"><div class="h-72 rounded-md bg-gradient-to-br from-slate-50 to-blue-50 p-5 text-sm text-slate-500">ECharts report canvas placeholder</div></app-chart-card>
      </main>
    </section>
  `,
})
export class ReportsComponent {
  readonly reports = ['Daily Collections Summary', 'Monthly Revenue Report', 'Outstanding Dues', 'User Growth Report', 'Committee Completion Rate', 'Late Payment Analysis', 'Fraud Risk Report', 'Leader Performance Report'];
  readonly active = signal(this.reports[0]);
}

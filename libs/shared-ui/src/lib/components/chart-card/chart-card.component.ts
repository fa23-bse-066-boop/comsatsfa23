import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  template: `
    <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <header class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 class="font-semibold text-slate-950 dark:text-white">{{ title }}</h3>
          @if (subtitle) { <p class="text-sm text-slate-500">{{ subtitle }}</p> }
        </div>
        @if (exportable) { <button type="button" class="rounded-md border border-slate-200 px-3 py-2 text-sm">Export</button> }
      </header>
      <ng-content></ng-content>
    </section>
  `,
})
export class ChartCardComponent {
  @Input() title = 'Chart';
  @Input() subtitle = '';
  @Input() exportable = true;
}

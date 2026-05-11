import { Component, Input } from '@angular/core';
import { AmountDisplayComponent } from '../amount-display/amount-display.component';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [AmountDisplayComponent],
  template: `
    <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-slate-500">{{ label }}</p>
          @if (currency) {
            <div class="mt-2"><app-amount-display [amount]="numericValue" size="lg" [colorVariant]="tone" /></div>
          } @else {
            <p class="mt-2 font-mono text-2xl font-semibold text-slate-950 dark:text-white">{{ value }}</p>
          }
        </div>
        <span class="grid h-10 w-10 place-items-center rounded-md bg-brand-50 text-brand-600">{{ icon }}</span>
      </div>
      @if (delta) {
        <p class="mt-4 text-sm" [class.text-emerald-600]="deltaPositive" [class.text-red-600]="!deltaPositive">{{ delta }} vs last period</p>
      }
    </article>
  `,
})
export class StatsCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() icon = '•';
  @Input() delta = '';
  @Input() deltaPositive = true;
  @Input() currency = false;
  @Input() tone: 'neutral' | 'success' | 'danger' = 'neutral';

  get numericValue(): number {
    return typeof this.value === 'number' ? this.value : Number(this.value) || 0;
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  template: `
    <div class="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      @for (row of rowItems; track row) {
        <div class="grid gap-3" [style.grid-template-columns]="gridTemplate">
          @for (column of columnItems; track column) {
            <div class="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
          }
        </div>
      }
    </div>
  `,
})
export class SkeletonTableComponent {
  @Input() rows = 5;
  @Input() columns = 6;

  get rowItems(): number[] {
    return Array.from({ length: this.rows }, (_, index) => index);
  }

  get columnItems(): number[] {
    return Array.from({ length: this.columns }, (_, index) => index);
  }

  get gridTemplate(): string {
    return `repeat(${this.columns}, minmax(0, 1fr))`;
  }
}

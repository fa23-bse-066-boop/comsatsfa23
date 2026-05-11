import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        <span class="text-2xl">{{ icon }}</span>
      </div>
      <h3 class="text-base font-semibold text-slate-950 dark:text-white">{{ title }}</h3>
      <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">{{ description }}</p>
      @if (actionLabel) {
        <button type="button" class="mt-5 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white" (click)="action.emit()">{{ actionLabel }}</button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'Nothing to show';
  @Input() description = 'There is no matching data yet.';
  @Input() icon = '•';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}

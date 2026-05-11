import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
        <section class="w-full max-w-md rounded-lg bg-white p-5 shadow-modal dark:bg-slate-900">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <p class="mt-2 text-sm text-slate-500">{{ message }}</p>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-md border border-slate-200 px-4 py-2 text-sm" (click)="cancelled.emit()">Cancel</button>
            <button type="button" class="rounded-md px-4 py-2 text-sm font-semibold text-white" [class]="confirmClass" (click)="confirmed.emit()">{{ confirmLabel }}</button>
          </div>
        </section>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm action';
  @Input() message = 'This action will update the mock state.';
  @Input() confirmLabel = 'Confirm';
  @Input() variant: 'danger' | 'warning' | 'info' = 'info';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get confirmClass(): string {
    return this.variant === 'danger' ? 'bg-red-600' : this.variant === 'warning' ? 'bg-amber-600' : 'bg-brand-600';
  }
}

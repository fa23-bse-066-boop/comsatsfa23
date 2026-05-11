import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ActionItem {
  id: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-action-menu',
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-2">
      @for (action of actions; track action.id) {
        <button
          type="button"
          class="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          [class.border-red-200]="action.danger"
          [class.text-red-700]="action.danger"
          [class.border-slate-200]="!action.danger"
          [disabled]="action.disabled"
          (click)="actionTriggered.emit(action)"
        >
          {{ action.label }}
        </button>
      }
    </div>
  `,
})
export class ActionMenuComponent {
  @Input() actions: ActionItem[] = [];
  @Output() actionTriggered = new EventEmitter<ActionItem>();
}

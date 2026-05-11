import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [class]="classes">{{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input() label = 'Active';
  @Input() tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' = 'neutral';

  get classes(): string {
    const tones = {
      neutral: 'bg-slate-100 text-slate-700',
      success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
      info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    };
    return tones[this.tone];
  }
}

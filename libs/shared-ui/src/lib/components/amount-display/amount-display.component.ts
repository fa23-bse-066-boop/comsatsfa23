import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="font-mono font-semibold tracking-normal" [ngClass]="classes">
      {{ currency }} {{ amount | number: '1.0-0' }}
    </span>
  `,
})
export class AmountDisplayComponent {
  @Input({ required: true }) amount = 0;
  @Input() currency = 'PKR';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() colorVariant: 'neutral' | 'success' | 'danger' = 'neutral';

  get classes(): string[] {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-2xl',
      xl: 'text-4xl',
    };
    const colors = {
      neutral: 'text-slate-950 dark:text-slate-50',
      success: 'text-emerald-600',
      danger: 'text-red-600',
    };
    return [sizes[this.size], colors[this.colorVariant]];
  }
}

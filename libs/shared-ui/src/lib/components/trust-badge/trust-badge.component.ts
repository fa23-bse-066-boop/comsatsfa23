import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TrustLevel } from '@dcms/shared-types';

@Component({
  selector: 'app-trust-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-1 rounded-full border font-medium" [ngClass]="classes">
      <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
      {{ level }}@if (score !== undefined) { <span class="font-mono"> {{ score }}</span> }
    </span>
  `,
})
export class TrustBadgeComponent {
  @Input({ required: true }) level: TrustLevel = TrustLevel.Bronze;
  @Input() score?: number;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get classes(): string[] {
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };
    const tones: Record<TrustLevel, string> = {
      [TrustLevel.Bronze]: 'border-amber-200 bg-amber-50 text-amber-700',
      [TrustLevel.Silver]: 'border-slate-200 bg-slate-50 text-slate-700',
      [TrustLevel.Gold]: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      [TrustLevel.Platinum]: 'border-purple-200 bg-purple-50 text-purple-700',
    };
    return [sizes[this.size], tones[this.level]];
  }
}

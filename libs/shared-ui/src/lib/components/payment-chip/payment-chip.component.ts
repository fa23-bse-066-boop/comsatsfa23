import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PaymentStatus } from '@dcms/shared-types';

@Component({
  selector: 'app-payment-chip',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="classes">{{ status }}</span>`,
})
export class PaymentChipComponent {
  @Input({ required: true }) status: PaymentStatus = PaymentStatus.Pending;

  get classes(): string {
    const tones: Record<PaymentStatus, string> = {
      [PaymentStatus.Pending]: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      [PaymentStatus.Approved]: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      [PaymentStatus.Rejected]: 'bg-red-50 text-red-700 ring-1 ring-red-200',
      [PaymentStatus.Late]: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    };
    return tones[this.status];
  }
}

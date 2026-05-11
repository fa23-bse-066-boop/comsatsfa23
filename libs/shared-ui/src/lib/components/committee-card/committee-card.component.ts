import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Committee, CommitteeType } from '@dcms/shared-types';
import { AmountDisplayComponent } from '../amount-display/amount-display.component';

@Component({
  selector: 'app-committee-card',
  standalone: true,
  imports: [CommonModule, AmountDisplayComponent],
  template: `
    <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised dark:border-slate-700 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-4">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="typeTone">{{ committee.type }}</span>
        @if (committee.isTrusted) {
          <span class="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">Trusted</span>
        }
      </div>
      <h3 class="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{{ committee.name }}</h3>
      <p class="mt-1 min-h-10 text-sm text-slate-500">{{ committee.description || 'Trusted rotating savings committee' }}</p>
      <div class="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <p class="text-xs uppercase tracking-wide text-slate-400">Monthly</p>
          <app-amount-display [amount]="committee.monthlyAmount" size="md" />
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-slate-400">Duration</p>
          <p class="font-semibold">{{ committee.duration }} months</p>
        </div>
      </div>
      <div class="mt-5">
        <div class="mb-2 flex justify-between text-xs text-slate-500">
          <span>{{ committee.currentMembers }}/{{ committee.totalMembers }} members</span>
          <span>{{ committee.totalMembers - committee.currentMembers }} slots left</span>
        </div>
        <div class="h-2 rounded-full bg-slate-100">
          <div class="h-2 rounded-full bg-brand-600" [style.width.%]="fill"></div>
        </div>
      </div>
      @if (showJoinButton) {
        <button type="button" class="mt-5 w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700" (click)="joinClicked.emit(committee)">
          Join Committee
        </button>
      }
    </article>
  `,
})
export class CommitteeCardComponent {
  @Input({ required: true }) committee!: Committee;
  @Input() variant: 'browse' | 'my-committee' | 'featured' = 'browse';
  @Input() showJoinButton = true;
  @Output() joinClicked = new EventEmitter<Committee>();

  get fill(): number {
    return Math.round((this.committee.currentMembers / this.committee.totalMembers) * 100);
  }

  get typeTone(): string {
    const tones: Record<CommitteeType, string> = {
      [CommitteeType.Lottery]: 'bg-blue-50 text-blue-700',
      [CommitteeType.Fixed]: 'bg-emerald-50 text-emerald-700',
      [CommitteeType.Bid]: 'bg-yellow-50 text-yellow-700',
    };
    return tones[this.committee.type];
  }
}

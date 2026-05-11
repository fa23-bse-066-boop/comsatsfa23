import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Committee } from '@dcms/shared-types';
import { CommitteeCardComponent, EmptyStateComponent, ModalComponent, PaginationComponent, ToastService } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-browse-committees',
  standalone: true,
  imports: [CommonModule, FormsModule, CommitteeCardComponent, EmptyStateComponent, ModalComponent, PaginationComponent],
  template: `
    <section class="space-y-6">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p class="text-sm font-semibold text-brand-600">Browse</p>
          <h1 class="text-3xl font-bold">Committees</h1>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (filter of filters; track filter) {
            <button type="button"
              class="rounded-full border border-slate-200 px-3 py-2 text-sm transition"
              (click)="activeFilter.set(filter)"
              [class.bg-brand-600]="activeFilter() === filter"
              [class.text-white]="activeFilter() === filter">
              {{ filter }}
            </button>
          }
        </div>
      </div>

      @if (filteredCommittees().length) {
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          @for (committee of filteredCommittees(); track committee.id) {
            <div class="relative">
              <app-committee-card [committee]="committee" (joinClicked)="openJoin($event)" />
              @if (joinStatus(committee.id); as status) {
                <div class="absolute bottom-4 left-4 right-4">
                  @if (status === 'Pending') {
                    <div class="rounded-lg bg-amber-100 px-3 py-2 text-center text-xs font-semibold text-amber-700">⏳ Request Pending</div>
                  } @else if (status === 'Approved') {
                    <div class="rounded-lg bg-emerald-100 px-3 py-2 text-center text-xs font-semibold text-emerald-700">✓ Member</div>
                  } @else if (status === 'Rejected') {
                    <div class="rounded-lg bg-red-100 px-3 py-2 text-center text-xs font-semibold text-red-700">✗ Rejected</div>
                  }
                </div>
              }
            </div>
          }
        </div>
        <app-pagination [total]="filteredCommittees().length" [pageSize]="12" />
      } @else {
        <app-empty-state title="No committees match your filters" actionLabel="Reset filters" (action)="activeFilter.set('All')" />
      }
    </section>

    <!-- Join Confirm Modal -->
    <app-modal [isOpen]="selectedCommittee() !== undefined" title="Confirm join request" (closed)="selectedCommittee.set(undefined)">
      @if (selectedCommittee(); as committee) {
        <div class="space-y-4">
          <p class="text-sm text-slate-500">
            <strong>{{ committee.name }}</strong> requires a monthly contribution of
            <strong>PKR {{ committee.monthlyAmount | number }}</strong> for {{ committee.duration }} months.
          </p>
          <p class="text-sm text-slate-500">Your request will be reviewed by the admin before you are added as a member.</p>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" [(ngModel)]="agreed" />
            I accept the committee terms and conditions.
          </label>
          <button type="button"
            [disabled]="!agreed"
            class="w-full rounded-md bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:bg-slate-400 transition"
            (click)="confirmJoin(committee)">
            Submit Join Request
          </button>
        </div>
      }
    </app-modal>
  `,
})
export class BrowseCommitteesComponent {
  readonly data = inject(UserDataService);
  readonly toast = inject(ToastService);

  readonly filters = ['All', 'Lottery', 'Fixed', 'Bid', 'Trusted'];
  readonly activeFilter = signal('All');
  readonly selectedCommittee = signal<Committee | undefined>(undefined);
  agreed = false;

  filteredCommittees = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') return this.data.committees();
    if (filter === 'Trusted') return this.data.committees().filter(c => c.isTrusted);
    return this.data.committees().filter(c => c.type === filter);
  });

  joinStatus(committeeId: string): string | null {
    return this.data.getJoinStatus(committeeId);
  }

  openJoin(committee: Committee): void {
    const status = this.joinStatus(committee.id);
    if (status) {
      this.toast.show(`Already ${status.toLowerCase()} for this committee`, 'info');
      return;
    }
    this.agreed = false;
    this.selectedCommittee.set(committee);
  }

  confirmJoin(committee: Committee): void {
    const added = this.data.joinCommittee(committee);
    this.selectedCommittee.set(undefined);
    if (added) {
      this.toast.show(`Join request sent for "${committee.name}" — awaiting admin approval`, 'success');
    } else {
      this.toast.show('You already have a request for this committee', 'info');
    }
  }
}

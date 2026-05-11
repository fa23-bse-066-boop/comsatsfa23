import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AmountDisplayComponent, PaymentChipComponent } from '@dcms/shared-ui';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-committee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AmountDisplayComponent, PaymentChipComponent],
  template: `
    <section class="space-y-6">
      <a routerLink="/committees" class="text-sm font-semibold text-brand-600">← Back to committees</a>
      @if (committee(); as item) {
        <header class="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h1 class="text-3xl font-bold">{{ item.name }}</h1>
          <p class="mt-2 text-slate-500">{{ item.description }}</p>
          <div class="mt-4"><app-amount-display [amount]="item.totalCollected" size="lg" /></div>
        </header>
        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 class="mb-4 font-semibold">Committee Members</h2>
          <div class="space-y-2 text-sm">
            <p class="text-slate-500">{{ item.currentMembers }} / {{ item.totalMembers }} members</p>
            <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div class="h-full rounded-full bg-brand-600" [style.width.%]="(item.currentMembers / item.totalMembers) * 100"></div>
            </div>
          </div>
        </section>
      } @else {
        <div class="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p class="text-slate-500">Committee not found</p>
        </div>
      }
    </section>
  `,
})
export class CommitteeDetailComponent {
  readonly data = inject(AdminDataService);
  private readonly route = inject(ActivatedRoute);

  committee = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.data.committees().find((item) => item.id === id) || null;
  });
}

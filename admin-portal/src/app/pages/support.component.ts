import { Component, inject, signal } from '@angular/core';
import { StatusBadgeComponent } from '@dcms/shared-ui';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-admin-support',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <section class="grid gap-6 xl:grid-cols-[340px_1fr]">
      <aside class="rounded-lg border border-slate-200 bg-white p-4 shadow-card"><h1 class="mb-4 text-xl font-bold">Tickets</h1>@for (ticket of data.tickets(); track ticket.id) { <button class="mb-2 block w-full rounded-md border p-3 text-left text-sm" (click)="active.set(ticket.id)">{{ ticket.subject }}<br><small>{{ ticket.priority }}</small></button> }</aside>
      <main class="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        @if (ticket(); as item) { <div class="mb-4 flex justify-between"><h2 class="text-xl font-semibold">{{ item.subject }}</h2><app-status-badge [label]="item.status" tone="info" /></div>@for (message of item.messages; track message.id) { <div class="mb-3 rounded-md bg-slate-50 p-3"><strong>{{ message.senderType }}</strong><p>{{ message.content }}</p></div> }<textarea class="mt-4 w-full rounded-md border border-slate-200 p-3" placeholder="Reply"></textarea> }
      </main>
    </section>
  `,
})
export class AdminSupportComponent {
  readonly data = inject(AdminDataService);
  readonly active = signal(this.data.tickets()[0]?.id ?? '');
  ticket() { return this.data.tickets().find((ticket) => ticket.id === this.active()); }
}

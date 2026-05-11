import { Component, inject, signal } from '@angular/core';
import { StatusBadgeComponent } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <section class="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside class="rounded-lg border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <div class="mb-4 flex items-center justify-between"><h1 class="text-xl font-bold">Support</h1><button class="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white">New Ticket</button></div>
        <div class="space-y-3">
          @for (ticket of data.tickets(); track ticket.id) {
            <button type="button" class="block w-full rounded-md border border-slate-100 p-3 text-left hover:bg-slate-50" (click)="activeTicket.set(ticket.id)">
              <p class="font-semibold">{{ ticket.subject }}</p>
              <p class="text-sm text-slate-500">#{{ ticket.id }} · {{ ticket.priority }}</p>
            </button>
          }
        </div>
      </aside>
      <main class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
        @if (selectedTicket(); as ticket) {
          <div class="mb-5 flex items-center justify-between">
            <div><h2 class="text-xl font-semibold">{{ ticket.subject }}</h2><p class="text-sm text-slate-500">Assigned to support team</p></div>
            <app-status-badge [label]="ticket.status" tone="info" />
          </div>
          <div class="space-y-4">
            @for (message of ticket.messages; track message.id) {
              <div class="rounded-md bg-slate-50 p-3 dark:bg-slate-800"><p class="text-sm font-semibold">{{ message.senderType }}</p><p class="mt-1">{{ message.content }}</p></div>
            }
          </div>
          <form class="mt-5 flex gap-2"><input class="flex-1 rounded-md border border-slate-200 px-3 py-3" placeholder="Reply..." /><button class="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white">Send</button></form>
        }
      </main>
    </section>
  `,
})
export class SupportComponent {
  readonly data = inject(UserDataService);
  readonly activeTicket = signal(this.data.tickets()[0]?.id ?? '');

  selectedTicket() {
    return this.data.tickets().find((ticket) => ticket.id === this.activeTicket());
  }
}

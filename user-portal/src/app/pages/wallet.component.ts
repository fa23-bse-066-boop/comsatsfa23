import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountDisplayComponent, ToastService } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, AmountDisplayComponent],
  template: `
    <section class="space-y-6">
      <h1 class="text-3xl font-bold">Wallet</h1>
      <article class="rounded-lg border border-brand-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <p class="text-sm text-slate-500">Available Balance</p>
        <div class="mt-2"><app-amount-display [amount]="data.currentUser().walletBalance" size="xl" colorVariant="success" /></div>
        <p class="mt-3 text-sm text-slate-500">Pending payout: PKR 8,000</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <button (click)="addFunds()" [disabled]="loading()" class="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:bg-brand-400 transition">
            {{ loading() ? 'Processing...' : 'Add Funds' }}
          </button>
          <button (click)="withdrawFunds()" [disabled]="loading()" class="rounded-md border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 transition">
            {{ loading() ? 'Processing...' : 'Withdraw Funds' }}
          </button>
        </div>
      </article>
      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <h2 class="mb-4 font-semibold">Transactions</h2>
        <div class="space-y-3">
          @for (payout of data.payouts(); track payout.id) {
            <div class="flex items-center justify-between rounded-md border border-slate-100 p-3">
              <div><p class="font-medium">Payout {{ payout.id }}</p><p class="text-sm text-slate-500">{{ payout.scheduledDate | date: 'mediumDate' }}</p></div>
              <app-amount-display [amount]="payout.amount" colorVariant="success" />
            </div>
          }
        </div>
      </section>
    </section>
  `,
})
export class WalletComponent {
  readonly data = inject(UserDataService);
  private readonly toast = inject(ToastService);

  loading = signal(false);

  addFunds() {
    this.loading.set(true);
    setTimeout(() => {
      this.toast.show('Feature coming soon — integrate with payment gateway', 'info');
      this.loading.set(false);
    }, 500);
  }

  withdrawFunds() {
    this.loading.set(true);
    setTimeout(() => {
      this.toast.show('Withdrawal requests open on 5th of each month', 'info');
      this.loading.set(false);
    }, 500);
  }
}

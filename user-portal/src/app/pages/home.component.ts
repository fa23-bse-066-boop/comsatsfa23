import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommitteeCardComponent, CountUpDirective } from '@dcms/shared-ui';
import { UserDataService } from '../core/user-data.service';
import { UserAuthService } from '../core/user-auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommitteeCardComponent, CountUpDirective],
  template: `
    <main class="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section class="relative overflow-hidden bg-brand-950 px-6 py-20 text-white lg:min-h-[88vh] lg:px-12">
        <div class="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,#3b82f6,transparent_30%),radial-gradient(circle_at_80%_30%,#10b981,transparent_26%),radial-gradient(circle_at_50%_80%,#f59e0b,transparent_24%)]"></div>
        <div class="relative mx-auto max-w-7xl">
          <nav class="mb-20 flex items-center justify-between">
            <strong class="text-xl">DCMS</strong>
            <div class="flex gap-3">
              <a routerLink="/auth/login" class="rounded-md border border-white/20 px-4 py-2 text-sm">Login</a>
              <a routerLink="/auth/register" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-950">Join Free</a>
            </div>
          </nav>
          <div class="max-w-3xl">
            <h1 class="font-display text-5xl font-bold leading-tight md:text-7xl">Your Money, Your Circle, Your Turn.</h1>
            <p class="mt-6 max-w-2xl text-lg text-blue-100">Pakistan's transparent rotating savings platform for verified members, trusted leaders, and predictable payouts.</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a routerLink="/auth/register" class="rounded-md bg-brand-500 px-5 py-3 font-semibold text-white">Join Free</a>
              <a href="#how" class="rounded-md border border-white/20 px-5 py-3 font-semibold text-white">See How It Works</a>
            </div>
          </div>
          <div class="mt-16 grid gap-4 md:grid-cols-3">
            @for (stat of stats; track stat.label) {
              <div class="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p class="font-mono text-2xl font-semibold" [appCountUp]="stat.value"></p>
                <p class="text-sm text-blue-100">{{ stat.label }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section id="how" class="mx-auto max-w-7xl px-6 py-16">
        <div class="grid gap-5 md:grid-cols-3">
          @for (step of steps; track step.title) {
            <article class="rounded-lg border border-slate-200 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <p class="font-mono text-sm text-brand-600">{{ step.index }}</p>
              <h2 class="mt-3 text-xl font-semibold">{{ step.title }}</h2>
              <p class="mt-2 text-slate-500">{{ step.body }}</p>
            </article>
          }
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 pb-20">
        <div class="mb-6 flex items-end justify-between">
          <div>
            <p class="text-sm font-semibold text-brand-600">Featured committees</p>
            <h2 class="text-3xl font-bold">Start with a trusted circle</h2>
          </div>
          <a routerLink="/committees" class="text-sm font-semibold text-brand-600">Browse all</a>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          @for (committee of data.featuredCommittees(); track committee.id) {
            <app-committee-card [committee]="committee" variant="featured" [showJoinButton]="false" />
          }
        </div>
      </section>
    </main>
  `,
})
export class HomeComponent implements OnInit {
  readonly data = inject(UserDataService);
  readonly auth = inject(UserAuthService);
  private readonly router = inject(Router);

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/dashboard');
    }
  }

  readonly stats = [
    { value: 14200, label: 'Verified Members' },
    { value: 240, label: 'PKR Millions Paid Out' },
    { value: 340, label: 'Active Committees' },
  ];
  readonly steps = [
    { index: '01', title: 'Join a Committee', body: 'Pick the amount, duration, leader, and trust profile that fits you.' },
    { index: '02', title: 'Pay Monthly', body: 'Upload receipts and track every contribution with transparent status updates.' },
    { index: '03', title: 'Receive Payout', body: 'Follow your turn, payout schedule, and wallet activity from one dashboard.' },
  ];
}

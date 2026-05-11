import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService, ToastService } from '@dcms/shared-ui';
import { UserAuthService } from '../core/user-auth.service';
import { UserDataService } from '../core/user-data.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <a routerLink="/dashboard" class="mb-8 flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 font-bold text-white">D</span>
          <span>
            <strong class="block">DCMS</strong>
            <small class="text-slate-500">Member portal</small>
          </span>
        </a>
        <nav class="space-y-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-brand-50 text-brand-700" class="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <button type="button" class="absolute bottom-4 left-4 right-4 rounded-md border border-slate-200 px-3 py-2 text-sm" (click)="auth.logout()">Logout</button>
      </aside>

      <div class="lg:pl-64">
        <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-slate-500">Welcome back</p>
              <h1 class="font-semibold">{{ data.currentUser().name }}</h1>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" class="rounded-md border border-slate-200 px-3 py-2 text-sm" (click)="data.markNotificationsRead()">Notifications {{ unreadCount }}</button>
              <button type="button" class="rounded-md border border-slate-200 px-3 py-2 text-sm" (click)="theme.toggle()">Theme</button>
            </div>
          </div>
        </header>
        <main class="mx-auto max-w-7xl p-4 pb-24 lg:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>

      <nav class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        @for (item of mobileItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="text-brand-700" class="rounded-md px-2 py-2 text-center text-slate-500">{{ item.label }}</a>
        }
      </nav>

      <div class="fixed right-4 top-20 z-50 space-y-2">
        @for (toast of toastService.messages(); track toast.id) {
          <button type="button" class="rounded-md bg-slate-950 px-4 py-3 text-left text-sm text-white shadow-raised" (click)="toastService.dismiss(toast.id)">{{ toast.title }}</button>
        }
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  readonly data = inject(UserDataService);
  readonly auth = inject(UserAuthService);
  readonly theme = inject(ThemeService);
  readonly toastService = inject(ToastService);
  readonly navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Browse Committees', path: '/committees' },
    { label: 'My Committees', path: '/my-committees' },
    { label: 'Payments', path: '/payment' },
    { label: 'Wallet', path: '/wallet' },
    { label: 'Profile', path: '/profile' },
    { label: 'Trust Score', path: '/trust-score' },
    { label: 'Support', path: '/support' },
  ];
  readonly mobileItems = this.navItems.slice(0, 5);

  get unreadCount(): number {
    return this.data.myNotifications().filter((notification) => !notification.isRead).length;
  }
}

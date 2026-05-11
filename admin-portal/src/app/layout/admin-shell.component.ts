import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '@dcms/shared-ui';
import { AdminAuthService } from '../core/admin-auth.service';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand-950 p-4 text-white lg:block">
        <div class="mb-8 flex items-center justify-between">
          <a routerLink="/dashboard" class="text-xl font-bold">DCMS Admin</a>
          <button type="button" class="rounded-md bg-white/10 px-2 py-1 text-sm">Menu</button>
        </div>
        <nav class="space-y-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-white/10 text-white" class="flex items-center justify-between rounded-md px-3 py-2 text-sm text-blue-100 hover:bg-white/10">
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="absolute bottom-4 left-4 right-4 rounded-lg bg-white/10 p-3">
          <p class="font-semibold">{{ auth.admin().name }}</p>
          <p class="text-xs text-blue-100">Super Admin</p>
          <button type="button" class="mt-3 text-sm text-blue-100" (click)="auth.logout()">Logout</button>
        </div>
      </aside>
      <div class="lg:pl-64">
        <header class="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">Operations</p>
              <h1 class="font-semibold">Digital Committee Management System</h1>
            </div>
            <div class="flex gap-2">
              <input class="hidden rounded-md border border-slate-200 px-3 py-2 text-sm md:block" placeholder="Search users, payments..." />
              <button type="button" class="rounded-md border border-slate-200 px-3 py-2 text-sm" (click)="theme.toggle()">Theme</button>
            </div>
          </div>
        </header>
        <main class="mx-auto max-w-[1400px] p-4 lg:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  readonly auth = inject(AdminAuthService);
  readonly data = inject(AdminDataService);
  readonly theme = inject(ThemeService);
  readonly navItems = [
    { label: 'Dashboard',     path: '/dashboard' },
    { label: 'Users',         path: '/users' },
    { label: 'Committees',    path: '/committees' },
    { label: 'Join Requests', path: '/join-requests' },
    { label: 'Payments',      path: '/payments' },
    { label: 'Payouts',       path: '/payouts' },
    { label: 'Leaders',       path: '/leaders' },
    { label: 'Support',       path: '/support' },
    { label: 'Reports',       path: '/reports' },
    { label: 'Settings',      path: '/settings' },
    { label: 'Audit Logs',    path: '/audit-logs' },
  ];
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
      <!-- Top Nav -->
      <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
              <div class="flex items-center gap-2">
                <span class="text-xl">🏦</span>
                <span class="font-bold text-slate-900 dark:text-white">DCMS</span>
              </div>
              <div class="hidden md:flex items-center gap-1">
                <a routerLink="/dashboard" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" [routerLinkActiveOptions]="{exact:true}"
                   class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Dashboard
                </a>
                <a routerLink="/committees" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                   class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Browse
                </a>
                <a routerLink="/my-committees" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                   class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  My Committees
                </a>
                <a routerLink="/payments" routerLinkActive="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                   class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Payments
                </a>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ auth.currentUser()?.name }}</span>
              <button (click)="logout()" class="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <ng-content></ng-content>
    </div>
  `,
})
export class UserLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminAuthService } from '../auth/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex min-h-screen bg-slate-950">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
        <div class="p-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🏦</span>
            <div>
              <p class="font-bold text-white text-sm">DCMS Admin</p>
              <p class="text-xs text-slate-400">{{ auth.currentAdmin()?.email }}</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white" [routerLinkActiveOptions]="{exact:true}"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>📊</span> Dashboard
          </a>
          <a routerLink="/committees" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>🏦</span> Committees
          </a>
          <a routerLink="/users" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>👥</span> Users
          </a>
          <a routerLink="/join-requests" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>📋</span> Join Requests
          </a>
          <a routerLink="/payments" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>💳</span> Payments
          </a>
          <a routerLink="/payouts" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>💸</span> Payouts
          </a>
          <a routerLink="/settings" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <div class="p-4 border-t border-slate-800">
          <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition text-sm font-medium">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 ml-64">
        <ng-content></ng-content>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  auth = inject(AdminAuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
  }
}

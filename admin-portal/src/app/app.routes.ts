import { Route } from '@angular/router';
import { adminAuthGuard } from './core/admin-auth.guard';

export const appRoutes: Route[] = [
  { path: 'auth/login', loadComponent: () => import('./pages/admin-login.component').then((m) => m.AdminLoginComponent) },
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./layout/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./pages/users.component').then((m) => m.UsersComponent) },
      { path: 'committees', loadComponent: () => import('./pages/committees.component').then((m) => m.CommitteesComponent) },
      { path: 'committees/:id', loadComponent: () => import('./pages/committee-detail.component').then((m) => m.CommitteeDetailComponent) },
      { path: 'join-requests', loadComponent: () => import('./pages/join-requests.component').then((m) => m.JoinRequestsComponent) },
      { path: 'payments', loadComponent: () => import('./pages/payments.component').then((m) => m.PaymentsComponent) },
      { path: 'payouts', loadComponent: () => import('./pages/payouts.component').then((m) => m.PayoutsComponent) },
      { path: 'support', loadComponent: () => import('./pages/support.component').then((m) => m.AdminSupportComponent) },
      { path: 'leaders', loadComponent: () => import('./pages/leaders.component').then((m) => m.LeadersComponent) },
      { path: 'reports', loadComponent: () => import('./pages/reports.component').then((m) => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings.component').then((m) => m.SettingsComponent) },
      { path: 'audit-logs', loadComponent: () => import('./pages/audit-logs.component').then((m) => m.AuditLogsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

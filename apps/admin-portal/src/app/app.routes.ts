import { Route } from '@angular/router';
import { adminAuthGuard } from './core/auth/admin-auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'users',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'committees',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/committees/committees.component').then(m => m.CommitteesComponent),
  },
  {
    path: 'payments',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/payments/payments.component').then(m => m.AdminPaymentsComponent),
  },
  {
    path: 'payouts',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/payouts/payouts.component').then(m => m.PayoutsComponent),
  },
  {
    path: 'join-requests',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/join-requests/join-requests.component').then(m => m.JoinRequestsComponent),
  },
  {
    path: 'settings',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

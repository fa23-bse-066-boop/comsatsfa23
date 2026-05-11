import { Route } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'committees',
    canActivate: [authGuard],
    loadComponent: () => import('./features/committees/browse-committees/browse-committees.component').then(m => m.BrowseCommitteesComponent),
  },
  {
    path: 'my-committees',
    canActivate: [authGuard],
    loadComponent: () => import('./features/committees/my-committees/my-committees.component').then(m => m.MyCommitteesComponent),
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () => import('./features/payments/payments.component').then(m => m.PaymentsComponent),
  },
  {
    path: 'wallet',
    canActivate: [authGuard],
    loadComponent: () => import('./features/wallet/wallet.component').then(m => m.WalletComponent),
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

import { Route } from '@angular/router';
import { userAuthGuard } from './core/user-auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'otp',
        loadComponent: () => import('./pages/otp.component').then((m) => m.OtpComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/forgot-password.component').then((m) => m.ForgotPasswordComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivate: [userAuthGuard],
    loadComponent: () => import('./layouts/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'committees',
        loadComponent: () => import('./pages/browse-committees.component').then((m) => m.BrowseCommitteesComponent),
      },
      {
        path: 'committees/browse',
        redirectTo: 'committees',
        pathMatch: 'full',
      },
      {
        path: 'my-committees',
        loadComponent: () => import('./pages/my-committees.component').then((m) => m.MyCommitteesComponent),
      },
      {
        path: 'committees/my',
        redirectTo: 'my-committees',
        pathMatch: 'full',
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/payment.component').then((m) => m.PaymentComponent),
      },
      {
        path: 'wallet',
        loadComponent: () => import('./pages/wallet.component').then((m) => m.WalletComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'trust-score',
        loadComponent: () => import('./pages/trust-score.component').then((m) => m.TrustScoreComponent),
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support.component').then((m) => m.SupportComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

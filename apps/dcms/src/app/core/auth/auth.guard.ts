import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}

export const authGuard: CanActivateFn = () => {
  const guard = inject(AuthGuardService);
  return guard.canActivate();
};

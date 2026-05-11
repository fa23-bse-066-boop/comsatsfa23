import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  if (inject(AdminAuthService).isAuthenticated()) {
    return true;
  }
  return inject(Router).createUrlTree(['/auth/login']);
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';

export const userAuthGuard: CanActivateFn = () => {
  const auth = inject(UserAuthService);
  if (auth.isAuthenticated()) {
    return true;
  }
  return inject(Router).createUrlTree(['/auth/login']);
};

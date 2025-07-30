import { AuthService } from './rest';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const login = inject(AuthService);
  const router = inject(Router);

  if (!login.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredAuthority: string = route.data['requiredAuthority'];

  if (login.hasAuthority(requiredAuthority)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

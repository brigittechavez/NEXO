import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as string;

  const userRole = authService.getUserRole();

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (requiredRole && userRole !== requiredRole) {
    return router.createUrlTree(['/']);
  }

  return true;
};

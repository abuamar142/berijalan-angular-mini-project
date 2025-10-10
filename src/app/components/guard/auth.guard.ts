import { inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isSessionAvailable()) {
    if (sessionStorage.getItem('user')) {
      router.navigate(['/']);
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};

import { inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

export const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Check if user has an active session
  if (auth.isSessionAvailable()) {
    if (sessionStorage.getItem('user')) {
      // User is authenticated, redirect to home page
      router.navigate(['/']);
      return false;
    }
  }

  // User is not authenticated, allow access to auth pages
  return true;
};

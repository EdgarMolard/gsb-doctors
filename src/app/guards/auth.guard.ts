import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/authentification';

/**
 * Guard qui protège les routes nécessitant une authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

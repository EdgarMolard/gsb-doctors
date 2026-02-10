import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthentificationService } from '../services/authentification';

/**
 * Interceptor qui gère les erreurs d'authentification
 * Déconnecte l'utilisateur si une erreur 401 ou 500 est reçue
 * Note: Pour l'API PHP GSB, l'auth se fait uniquement via /connexion (pas de token Bearer)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthentificationService);
  
  // Pour l'API GSB, pas besoin d'ajouter le token dans les headers
  // L'authentification se fait uniquement via le endpoint /connexion

  return next(req).pipe(
    catchError((error) => {
      // L'API GSB retourne 500 pour les erreurs d'authentification
      if (error.status === 500 || error.status === 401) {
        console.log('Session expirée - Déconnexion automatique');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};

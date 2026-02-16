import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthentificationService } from '../services/authentification';
import { Router } from '@angular/router';

/**
 * Interceptor qui ajoute le token JWT aux en-têtes des requêtes
 * et gère les erreurs d'authentification
 * Déconnecte l'utilisateur si une erreur 401 est reçue
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);
  
  // Récupère le token JWT directement depuis sessionStorage pour éviter les problèmes de timing
  const TOKEN_KEY = 'auth_token';
  const token = sessionStorage.getItem(TOKEN_KEY);
  
  // Ajoute le token dans l'en-tête Authorization si disponible
  // Skip pour la requête de connexion elle-même
  if (token && !req.url.includes('/connexion')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // L'API retourne 401 pour les erreurs d'authentification
      if (error.status === 401 && !req.url.includes('/connexion')) {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem('auth_user');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

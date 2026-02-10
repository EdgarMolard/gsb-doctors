import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of, delay } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Structure de réponse pour stocker la session utilisateur
// Pour l'API GSB: token = ID utilisateur, user = {id, nom, prenom}
interface LoginResponse {
  token: string;
  user?: any;
}

/**
 * Service d'authentification pour l'API PHP GSB
 * Gère connexion (GET /connexion?login=xxx&mdp=yyy), déconnexion et état de session
 * Stocke l'ID utilisateur comme token en sessionStorage
 */
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_URL = environment.apiUrl;

  // État d'authentification (Observable + Signal)
  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authState$ = this.authStateSubject.asObservable();
  public authSignal = signal<boolean>(this.isAuthenticated());
  
  /** Connexion avec login et mot de passe (API PHP GSB) */
  login(email: string, password: string): Observable<LoginResponse> {
    if (environment.useMockAuth) {
      return this.mockLogin(email, password);
    }
    
    // Appel GET avec query params pour l'API PHP GSB
    const params = { login: email, mdp: password };
    
    return this.http.get<any>(`${this.API_URL}${environment.endpoints.connexion}`, { params })
      .pipe(
        tap(response => {
          // L'API retourne: {"id":"a131","nom":"Aribi","prenom":"Alain",...}
          const sessionData: LoginResponse = {
            token: response.id,  // Utilise l'id comme token
            user: {
              id: response.id,
              nom: response.nom,
              prenom: response.prenom
            }
          };
          this.setSession(sessionData);
          this.updateAuthState(true);
        }),
        catchError((error) => {
          // L'API PHP retourne 500 quand les identifiants sont incorrects
          if (error.status === 500) {
            return throwError(() => new Error('Login ou mot de passe incorrect'));
          }
          return this.handleError(error);
        })
      );
  }

  /** Authentification mock pour le développement (voir environment.ts) */
  private mockLogin(email: string, password: string): Observable<LoginResponse> {
    console.log('🔧 Mode MOCK - Login:', environment.testCredentials.email);
    
    if (email !== environment.testCredentials.email || 
        password !== environment.testCredentials.password) {
      console.log('❌ Identifiants incorrects');
      return throwError(() => new Error('Login ou mot de passe incorrect')).pipe(delay(800));
    }
    
    console.log('✅ Connexion réussie');
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: { email, name: 'Utilisateur Test', role: 'admin' }
    };
    
    return of(mockResponse).pipe(
      delay(800),
      tap(response => {
        this.setSession(response);
        this.updateAuthState(true);
      })
    );
  }

  /** Déconnexion et redirection vers /login */
  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.updateAuthState(false);
    this.router.navigate(['/login']);
  }

  /** Vérifie si l'utilisateur est authentifié (vérifie la présence du token en session) */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  /** Récupère le token de session (ID utilisateur pour l'API GSB) */
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /** Récupère les infos de l'utilisateur connecté */
  getCurrentUser(): any | null {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /** Stocke le token et les infos utilisateur en session */
  private setSession(response: LoginResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, response.token);
    if (response.user) {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
  }

  /** Met à jour l'état d'authentification */
  private updateAuthState(isAuthenticated: boolean): void {
    this.authStateSubject.next(isAuthenticated);
    this.authSignal.set(isAuthenticated);
  }

  /** Gère les erreurs HTTP de l'API */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401: errorMessage = 'Login ou mot de passe incorrect'; break;
        case 403: errorMessage = 'Accès refusé'; break;
        case 404: errorMessage = 'Service non disponible'; break;
        case 500: errorMessage = 'Login ou mot de passe incorrect'; break;
        default: errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    console.error('Erreur d\'authentification:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

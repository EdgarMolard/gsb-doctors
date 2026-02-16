import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Point d'entrée de l'application Angular
 * 
 * IMPORTANT: Utilise appConfig qui contient tous les providers nécessaires,
 * notamment le HttpClient avec l'intercepteur d'authentification (authInterceptor).
 * Ne pas fournir les providers inline ici pour éviter d'écraser la configuration.
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));




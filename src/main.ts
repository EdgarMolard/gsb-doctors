import { bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes.js'
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

bootstrapApplication(App , {
  providers:[provideRouter(routes) , provideHttpClient()]
}).catch((err) => console.error(err));




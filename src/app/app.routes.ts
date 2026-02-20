import { Routes } from '@angular/router';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page';
import { LoginPage } from './pages/login-page/login-page';
import { HubPageComponent } from './pages/hub-page/hub-page';
import { RapportsPageComponent } from './pages/rapports-page/rapports-page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'hub', component: HubPageComponent, canActivate: [authGuard] },
    { path: 'doctors', component: DoctorsPageComponent, canActivate: [authGuard] },
    { path: 'rapports', component: RapportsPageComponent, canActivate: [authGuard] },
    { path: 'medecins', redirectTo: 'doctors', pathMatch: 'full' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];

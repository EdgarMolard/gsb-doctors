import { Routes } from '@angular/router';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page';
import { LoginPage } from './pages/login-page/login-page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'medecins', component: DoctorsPageComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];

import { Routes } from '@angular/router';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page';

export const routes: Routes = [
    { path: 'medecins', component: DoctorsPageComponent},
    { path: '' , redirectTo: 'medecins' , pathMatch: 'full'},
    { path: '**' , redirectTo: 'medecins'}
];

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../services/doctors.service';
import { AuthentificationService } from '../../services/authentification';
import { Doctor } from '../../types/doctor.interface';
import { DoctorCard } from '../../components/doctor-card/doctor-card';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors-page',  
  standalone: true,  
  imports: [CommonModule,DoctorCard,FormsModule],  
  templateUrl: './doctors-page.html',
  styleUrls: ['./doctors-page.css']
})

export class DoctorsPageComponent implements OnInit {
  searchValue = '';

  private doctorsService = inject(DoctorsService);
  private authService = inject(AuthentificationService);
  private router = inject(Router);
  
  // Utiliser un signal mutable qu'on peut mettre à jour
  private doctorsSignal = signal<Doctor[]>([]);
  
  // Exposer le signal comme fonction pour la compatibilité avec le template
  doctors = () => this.doctorsSignal();

  ngOnInit() {
    // Vérifier que l'utilisateur est bien authentifié
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Charger les médecins après la vérification du token
    this.doctorsService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctorsSignal.set(doctors);
      },
      error: (error) => {
        // Gestion d'erreur silencieuse - l'intercepteur redirigera vers /login si 401
      }
    });
  }

  getDoctorsArray() {
    return this.doctors();
  }

  /** Filtre les médecins selon la valeur de recherche */
  filterDoctors() {
    const doctorsTab = this.getDoctorsArray();
    return doctorsTab.filter(doctor =>
      doctor.last_name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      doctor.first_name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      doctor.specialite?.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  /** Déconnecte l'utilisateur */
  logout(): void {
    this.authService.logout();
  }

}
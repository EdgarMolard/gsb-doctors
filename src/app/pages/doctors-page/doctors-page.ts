import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsService } from '../../services/doctors.service';
import { AuthentificationService } from '../../services/authentification';
import { Doctor } from '../../types/doctor.interface';
import { DoctorCard } from '../../components/doctor-card/doctor-card';
import { EditDoctorModal } from '../../components/edit-doctor-modal/edit-doctor-modal';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors-page',  
  standalone: true,  
  imports: [CommonModule, DoctorCard, EditDoctorModal, FormsModule],  
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
  
  // Signal pour gérer le modal d'édition
  selectedDoctor = signal<Doctor | null>(null);
  isModalOpen = computed(() => this.selectedDoctor() !== null);
  
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

  /** Redirige vers la page d'accueil */
  goHome(): void {
    this.router.navigate(['/hub']);
  }

  /** Ouvre le modal d'édition pour un docteur */
  onEditDoctor(doctor: Doctor): void {
    this.selectedDoctor.set(doctor);
  }

  /** Ferme le modal d'édition */
  onModalCancelled(): void {
    this.selectedDoctor.set(null);
  }

  /** Sauvegarde les modifications du docteur */
  onDoctorSaved(data: { id: number; adresse: string; specialite: string }): void {
    this.doctorsService.updateDoctor(data.id, data.adresse, data.specialite).subscribe({
      next: () => {
        // Rafraîchir la liste des docteurs
        this.doctorsService.getDoctors().subscribe({
          next: (doctors) => {
            this.doctorsSignal.set(doctors);
            this.selectedDoctor.set(null); // Fermer le modal
          },
          error: (error) => {
            console.error('Erreur lors du rafraîchissement de la liste', error);
            this.selectedDoctor.set(null);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
        // Le modal reste ouvert pour que l'utilisateur puisse réessayer
        // Note: il faudrait idéalement afficher un message d'erreur dans le modal
      }
    });
  }

}
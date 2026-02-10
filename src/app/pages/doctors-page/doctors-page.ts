import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DoctorsService } from '../../services/doctors.service';
import { AuthentificationService } from '../../services/authentification';
import { Doctor } from '../../types/doctor.interface';
import { DoctorCard } from '../../components/doctor-card/doctor-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-page',  
  standalone: true,  
  imports: [CommonModule,DoctorCard,FormsModule],  
  templateUrl: './doctors-page.html',
  styleUrls: ['./doctors-page.css']
})

export class DoctorsPageComponent {
  searchValue = '';

  private doctorsService = inject(DoctorsService);
  private authService = inject(AuthentificationService);
  
  doctors = toSignal(this.doctorsService.getDoctors(), {
    initialValue: [] as Doctor[]
  });

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
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../../types/doctor.interface';

@Component({
  selector: 'app-edit-doctor-modal',
  imports: [FormsModule],
  templateUrl: './edit-doctor-modal.html',
  styleUrl: './edit-doctor-modal.css'
})
export class EditDoctorModal {
  doctor = input.required<Doctor>();
  saved = output<{ id: number; adresse: string; specialite: string }>();
  cancelled = output<void>();

  isLoading = signal(false);
  errorMessage = signal('');

  // Valeurs éditables (copiées depuis le docteur)
  adresse = signal('');
  specialite = signal('');

  ngOnInit() {
    // Initialiser les champs avec les valeurs actuelles
    this.adresse.set(this.doctor().adresse);
    this.specialite.set(this.doctor().specialite);
  }

  onCancel() {
    this.cancelled.emit();
  }

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.saved.emit({
      id: this.doctor().id,
      adresse: this.adresse(),
      specialite: this.specialite()
    });
  }

  onOverlayClick(event: MouseEvent) {
    // Fermer le modal si on clique sur l'overlay (pas sur le contenu)
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}

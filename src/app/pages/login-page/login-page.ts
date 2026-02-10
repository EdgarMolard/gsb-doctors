import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../services/authentification';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private authService = inject(AuthentificationService);
  private router = inject(Router);

  // Note: 'email' est utilisé pour le login GSB (pas forcément un email)
  email: string = '';  // Login utilisateur
  password: string = '';  // Mot de passe
  isLoading: boolean = false;
  errorMessage: string = '';

  /** Soumission du formulaire de connexion */
  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Pas de validation email pour l'API GSB (utilise un login)

    this.isLoading = true;
    
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/medecins']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur de connexion';
      }
    });
  }
}

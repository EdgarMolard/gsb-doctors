import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../services/authentification';

/**
 * Page hub - Tableau de bord après connexion
 * Affiche les différentes ressources disponibles
 */
@Component({
  selector: 'app-hub-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hub-page.html',
  styleUrls: ['./hub-page.css']
})
export class HubPageComponent {
  private router = inject(Router);
  private authService = inject(AuthentificationService);

  /** Ressources disponibles */
  resources = [
    {
      title: 'Médecins',
      description: 'Consulter et gérer la liste des médecins',
      icon: '👨‍⚕️',
      route: '/doctors',
      color: '#4A90E2'
    },
    {
      title: 'Rapports',
      description: 'Gérer mes rapports de visite',
      icon: '📋',
      route: '/rapports',
      color: '#28a745'
    }
    // Futures ressources à ajouter ici
  ];

  /** Informations de l'utilisateur connecté */
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  /** Navigue vers une ressource */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /** Déconnexion */
  logout(): void {
    this.authService.logout();
  }
}

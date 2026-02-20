import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RapportsService } from '../../services/rapports.service';
import { AuthentificationService } from '../../services/authentification';
import { Rapport, RapportCreate, RapportUpdate } from '../../types/rapport.interface';

/**
 * Page de gestion des rapports du visiteur connecté
 * Permet de consulter, créer, modifier et supprimer ses rapports
 */
@Component({
  selector: 'app-rapports-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapports-page.html',
  styleUrls: ['./rapports-page.css']
})
export class RapportsPageComponent implements OnInit {
  private rapportsService = inject(RapportsService);
  private authService = inject(AuthentificationService);
  private router = inject(Router);

  // Données
  rapports = signal<Rapport[]>([]);
  medecins = signal<any[]>([]);
  
  // États des modals et formulaires
  showAddModal = signal(false);
  showEditModal = signal(false);
  selectedRapport = signal<Rapport | null>(null);
  
  // Formulaire d'ajout
  nouveauRapport: RapportCreate = {
    idMedecin: 0,
    motif: '',
    bilan: '',
    date: new Date().toISOString().split('T')[0]
  };
  
  // Formulaire de modification
  rapportModifie: RapportUpdate = {
    motif: '',
    bilan: ''
  };
  
  // Recherche de médecin pour l'ajout
  searchMedecin = '';

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.chargerRapports();
  }

  /** Charge tous les rapports du visiteur */
  chargerRapports(): void {
    this.rapportsService.getRapportsVisiteur().subscribe({
      next: (rapports) => {
        this.rapports.set(rapports);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rapports', error);
      }
    });
  }

  /** Recherche des médecins pour le formulaire d'ajout */
  rechercherMedecins(): void {
    if (this.searchMedecin.length >= 2) {
      this.rapportsService.rechercherMedecins(this.searchMedecin).subscribe({
        next: (medecins) => {
          this.medecins.set(medecins);
        },
        error: (error) => {
          console.error('Erreur lors de la recherche de médecins', error);
        }
      });
    } else {
      this.medecins.set([]);
    }
  }

  /** Sélectionne un médecin pour le nouveau rapport */
  selectionnerMedecin(medecin: any): void {
    this.nouveauRapport.idMedecin = medecin.id;
    this.searchMedecin = `${medecin.nom} ${medecin.prenom}`;
    this.medecins.set([]);
  }

  /** Ouvre le modal d'ajout */
  ouvrirModalAjout(): void {
    this.nouveauRapport = {
      idMedecin: 0,
      motif: '',
      bilan: '',
      date: new Date().toISOString().split('T')[0]
    };
    this.searchMedecin = '';
    this.medecins.set([]);
    this.showAddModal.set(true);
  }

  /** Ferme le modal d'ajout */
  fermerModalAjout(): void {
    this.showAddModal.set(false);
  }

  /** Ajoute un nouveau rapport */
  ajouterRapport(): void {
    if (!this.nouveauRapport.idMedecin || !this.nouveauRapport.motif || !this.nouveauRapport.bilan) {
      alert('Veuillez renseigner tous les champs obligatoires');
      return;
    }

    this.rapportsService.ajouterRapport(this.nouveauRapport).subscribe({
      next: () => {
        this.chargerRapports();
        this.fermerModalAjout();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du rapport', error);
        alert('Erreur lors de l\'ajout du rapport');
      }
    });
  }

  /** Ouvre le modal de modification */
  ouvrirModalModification(rapport: Rapport): void {
    this.selectedRapport.set(rapport);
    this.rapportModifie = {
      motif: rapport.motif,
      bilan: rapport.bilan
    };
    this.showEditModal.set(true);
  }

  /** Ferme le modal de modification */
  fermerModalModification(): void {
    this.showEditModal.set(false);
    this.selectedRapport.set(null);
  }

  /** Modifie un rapport */
  modifierRapport(): void {
    const rapport = this.selectedRapport();
    if (!rapport) return;

    if (!this.rapportModifie.motif || !this.rapportModifie.bilan) {
      alert('Veuillez renseigner tous les champs');
      return;
    }

    this.rapportsService.modifierRapport(rapport.idRapport, this.rapportModifie).subscribe({
      next: () => {
        this.chargerRapports();
        this.fermerModalModification();
      },
      error: (error) => {
        console.error('Erreur lors de la modification du rapport', error);
        alert('Erreur lors de la modification du rapport');
      }
    });
  }

  /** Supprime un rapport avec confirmation */
  supprimerRapport(rapport: Rapport): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le rapport concernant Dr. ${rapport.nomMedecin} ${rapport.prenomMedecin} du ${this.formatDate(rapport.date)} ?`)) {
      this.rapportsService.supprimerRapport(rapport.idRapport).subscribe({
        next: () => {
          this.chargerRapports();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du rapport', error);
          alert('Erreur lors de la suppression du rapport');
        }
      });
    }
  }

  /** Formate une date pour l'affichage */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  /** Retour au hub */
  goHome(): void {
    this.router.navigate(['/hub']);
  }

  /** Déconnexion */
  logout(): void {
    this.authService.logout();
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rapport, RapportCreate, RapportUpdate } from '../types/rapport.interface';
import { environment } from '../../environments/environment';

/**
 * Service de gestion des rapports du visiteur
 * Gère les opérations CRUD sur les rapports du visiteur connecté
 */
@Injectable({ providedIn: 'root' })
export class RapportsService {
  private httpClient = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  
  /**
   * Récupère tous les rapports du visiteur connecté
   */
  getRapportsVisiteur(): Observable<Rapport[]> {
    return this.httpClient.get<Rapport[]>(`${this.API_URL}rapportsvisiteur`);
  }

  /**
   * Récupère un rapport spécifique
   */
  getRapport(idRapport: number): Observable<Rapport> {
    return this.httpClient.get<Rapport>(`${this.API_URL}rapport/${idRapport}`);
  }

  /**
   * Ajoute un nouveau rapport
   */
  ajouterRapport(rapport: RapportCreate): Observable<any> {
    const params = new HttpParams()
      .set('idMedecin', rapport.idMedecin.toString())
      .set('motif', rapport.motif)
      .set('bilan', rapport.bilan)
      .set('date', rapport.date)
      .set('medicaments', rapport.medicaments ? JSON.stringify(rapport.medicaments) : '0');
    
    return this.httpClient.post(`${this.API_URL}nouveaurapport`, null, { params });
  }

  /**
   * Modifie un rapport existant
   */
  modifierRapport(idRapport: number, rapport: RapportUpdate): Observable<any> {
    return this.httpClient.put(`${this.API_URL}rapport/${idRapport}`, {
      motif: rapport.motif,
      bilan: rapport.bilan
    });
  }

  /**
   * Supprime un rapport
   */
  supprimerRapport(idRapport: number): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}rapport/${idRapport}`);
  }

  /**
   * Recherche des médecins par nom (pour la création de rapports)
   */
  rechercherMedecins(nom: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}medecins?nom=${nom}`);
  }
}

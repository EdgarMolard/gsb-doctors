import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Medecin } from '../types/medecin.interface';
import { Doctor } from '../types/doctor.interface';
import { convertMedecinToDoctor } from '../helpers/convert-medecin-to-doctor';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private httpClient = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  
  getDoctors(): Observable<Doctor[]> {
    return this.httpClient.get<Medecin[]>(`${this.API_URL}${environment.endpoints.medecins}?nom=`)
      .pipe(
		      map((medecins) => medecins.map(convertMedecinToDoctor))
      );  
  }

  updateDoctor(id: number, adresse: string, specialite: string): Observable<any> {
    return this.httpClient.put(`${this.API_URL}medecin/${id}`, {
      adresse,
      specialite,
      tel: '' // Backend nécessite ce champ mais on ne le gère pas côté frontend
    });
  }
}
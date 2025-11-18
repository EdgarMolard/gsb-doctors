import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Medecin } from '../types/medecin.interface';
import { Doctor } from '../types/doctor.interface';
import { convertMedecinToDoctor } from '../helpers/convert-medecin-to-doctor';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private httpClient = inject(HttpClient);  
  
  getDoctors(): Observable<Doctor[]> {
    return this.httpClient.get<Medecin[]>('assets/doctors.json')
      .pipe(
		      map((medecins) => medecins.map(convertMedecinToDoctor))
      );  
  }
}
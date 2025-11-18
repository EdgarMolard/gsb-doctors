import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../types/doctor.interface';
import { DoctorCard } from '../../components/doctor-card/doctor-card';

@Component({
  selector: 'app-doctors-page',  
  standalone: true,  
  imports: [CommonModule,DoctorCard],  
  templateUrl: './doctors-page.html',
  styleUrls: ['./doctors-page.css']
})

export class DoctorsPageComponent {
  private doctorsService = inject(DoctorsService);  
  
  doctors = toSignal(this.doctorsService.getDoctors(), {
    initialValue: [] as Doctor[]
  });
}
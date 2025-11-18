import { Component, Input, Signal, input } from '@angular/core';
import { Doctor } from '../../types/doctor.interface';


@Component({
  selector: 'app-doctor-card',
  imports: [],
  templateUrl: './doctor-card.html',
  styleUrl: './doctor-card.css'
})
export class DoctorCard {
   doctor = input.required<Doctor>();
}

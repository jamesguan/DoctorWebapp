import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  user: {} = {};
  doctors: any[] = [];
  appointments: any[] = [];
  constructor(private patientService: PatientService){

  }
  ngOnInit(){
    this.getUser();
    this.getDoctors();
    this.getAppointments();
  }
  getUser(): void {
    this.patientService.getUser()
        .subscribe(user => this.user = user);
  }
  getDoctors(): void {
    this.patientService.getDoctors()
        .subscribe(doctors => this.doctors = doctors);
  }
  getAppointments(): void {
    this.patientService.getAppointments()
        .subscribe(appointments => this.appointments = appointments);
  }
  setAppointment(f: NgForm): void {
    if (!f.valid){
      alert("Please complete all fields");
      return;
    }
    this.patientService.addAppointment(f.value)
  }
}

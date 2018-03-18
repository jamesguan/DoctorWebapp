import { Component } from '@angular/core';

@Component({
  selector: 'doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent {
  title = 'Willhelm International';
  patients = [
    {'_id': 1232123, firstName: 'Razgriz', prescriptions: [{name: 'Ibuprofin'}]},
    {'_id': 3333323, firstName: 'Garuda', prescriptions: [{name: 'Ibuprofin'}]}
  ];
}

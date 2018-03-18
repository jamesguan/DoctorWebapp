import { Component, OnInit } from '@angular/core';
import { Doctor } from './doctor';
import { AdminService } from './admin.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private adminService: AdminService){

  }
  ngOnInit(){
    this.getDoctors();
    this.getPatients();
    this.getUser();
    this.breakpoint = (window.innerWidth <= 800) ? 1 : 2;
  }
  getDoctors(): void {
    this.adminService.getDoctors()
        .subscribe(doctors => this.doctors = doctors);
  }
  getPatients(): void {
    this.adminService.getPatients()
        .subscribe(patients => this.patients = patients);
  }
  getUser(): void {
    this.adminService.getUser()
        .subscribe(user => this.user = user);
  }
  deleteUser(id): void {
    this.adminService.deleteUser(id);
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 800) ? 1 : 2;
  }
  addDoctor(f: NgForm): void {
    if (!f.valid){
      alert("Please complete all fields");
      return;
    }
    this.adminService.addDoctor(f.value.firstName, f.value.lastName);
  }
}

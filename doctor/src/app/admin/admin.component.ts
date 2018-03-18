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
    this.getUser();
    console.log(window);
    this.breakpoint = (window.innerWidth <= 800) ? 1 : 2;
  }
  getDoctors(): void {
    this.adminService.getDoctors()
        .subscribe(doctors => this.doctors = doctors);
  }
  getUser(): void {
    this.adminService.getUser()
        .subscribe(user => this.user = user);
  }
  deleteMe(id): void {
    this.doctors.forEach((element, index, object)=>{
      if (element.id === id)
        object.splice(index,1);
    });
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 800) ? 1 : 2;
  }
}

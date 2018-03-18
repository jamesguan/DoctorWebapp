import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Admin } from './admin';
import { Doctor } from './doctor';
import { DOCTORS } from './mock-doctors';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';


@Injectable()
export class AdminService {
  user: {} = {};
  doctors: Doctor[] = [];
  constructor(private http: HttpClient, private router: Router){
    this.http.get('http://localhost:20000/view/admin', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      })
    })
    .subscribe(
      (data: any[]) => {
        data.doctors.forEach((elem) => {
          let doc = new Doctor(elem._id, elem.firstName, elem.lastName)
          this.doctors.push(doc);
        });
        this.user = Object.assign(this.user, data.user);
      },
      (error) => {
        switch(error.status){
          case 404:
          case 500:
            break;
          default:
            localStorage.clear();
            this.router.navigate(['/']);
        }
      })
    );
  }
  getUser(): Observable<{}>{
    return of(this.user);
  }
  getDoctors(): Observable<Doctor[]>{
    return of(this.doctors);
  }
}

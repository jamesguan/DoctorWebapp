import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Admin } from './admin';
import { Doctor } from './doctor';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';


@Injectable()
export class AdminService {
  user: {} = {};
  doctors: Doctor[] = [];
  patients: any[] = [];
  constructor(private http: HttpClient, private router: Router){
    this.getData();
  }
  getData(){
    this.http.get<any>('http://localhost:20000/view/admin', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      })
    })
    .pipe(retry(10))
    .subscribe(
      (data => {
        this.doctors.splice(0, this.doctors.length);
        data.doctors.forEach((elem) => {
          let doc = new Doctor(elem._id, elem.firstName, elem.lastName)
          this.doctors.push(doc);
        });
        this.user = Object.assign(this.user, data.user);
        this.doctors.sort((a: any,b: any) => {
          if (a.lastName === b.lastName) {
            return ( a.firstName > a.firstName ? 1 : -1 );
          }
          return ( a.lastName > b.lastName ? 1 : -1);
        });
        this.patients.splice(0, this.patients.length);
        data.patients.forEach((elem) => {
          let patient = JSON.parse(JSON.stringify(elem));
          this.patients.push(patient);
        });
      }),
      (error) => {
        switch(error.status){
          case 404:
          case 500:
            break;
          default:
            localStorage.clear();
            this.router.navigate(['/']);
        }
      });
  }
  getUser(): Observable<{}>{
    return of(this.user);
  }

  getDoctors(): Observable<Doctor[]>{
    return of(this.doctors);
  }

  getPatients(): Observable<any[]>{
    return of(this.patients);
  }

  addDoctor(fName, lName): void {
    this.http.post(`http://localhost:20000/doctor`, {
      firstName: fName,
      lastName: lName
    } ,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      })
    })
    .subscribe(
      (data: any[]) => {
        this.getData();
      },
      (error) => {
        switch(error.status){
          case 404:
          case 500:
            break;
          //default:
            //localStorage.clear();
            //this.router.navigate(['/']);
        }
      });
  }
  deleteUser(id): void{
    this.http.put(`http://localhost:20000/user/${id}/inactive`, {status: false} ,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      })
    })
    .subscribe(
      (data: any[]) => {
        this.getData();
      },
      (error) => {
        switch(error.status){
          case 404:
          case 500:
            break;
          //default:
            //localStorage.clear();
            //this.router.navigate(['/']);
        }
      });
  }
}

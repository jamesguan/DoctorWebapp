import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';


@Injectable()
export class PatientService {
  user: {} = {};
  doctors: any[] = [];
  appointments: any[] = [];
  constructor(private http: HttpClient, private router: Router){
    this.getData();
  }
  getData(){
    this.http.get<any>('http://localhost:20000/view/patient', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      })
    })
    .pipe(retry(10))
    .subscribe(
      (data => {
        this.user = Object.assign(this.user, data.user);
        this.doctors.splice(0, this.doctors.length);
        data.doctors.forEach((elem) => {
          if (elem){
            let doctor = JSON.parse(JSON.stringify(elem));
            this.doctors.push(doctor);
          }
        });
        this.appointments.splice(0, this.appointments.length);
        data.appointments.forEach((elem) => {


          let appointment = JSON.parse(JSON.stringify(elem));
          data.doctors.forEach((doc) => {
            if (doc._id === elem.doctor){
                appointment.doctorName = `Dr.${doc.lastName}, ${doc.firstName}`;
            }
          });
          this.appointments.push(appointment);
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
  getDoctors(): Observable<any[]>{
    return of(this.doctors);
  }
  getAppointments(): Observable<any[]>{
    return of(this.appointments);
  }
  addAppointment(values): void {
    let payload = {
      doctor: values.doctor,
      time: values.date.toString()
    }

    this.http.post(`http://localhost:20000/appointment`, payload ,{
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

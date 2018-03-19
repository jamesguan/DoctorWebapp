import { PLATFORM_ID, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser} from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class LandingService {

  constructor(private http: HttpClient, private router: Router){

  }
  signIn(data): void{
    this.http.post<any>('http://18.188.57.65:20000/auth', data, httpOptions)
    .subscribe(
      (data => {
        localStorage.setItem("access_token", data.access_token);
        switch(data.type){
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'doctor':
            this.router.navigate(['/doctor']);
            break;
          case 'patient':
            this.router.navigate(['/patient']);
            break;
        }
      }),
      (error => {
        switch(error.status){
          case 404:
          case 500:
            break;
          default:
            localStorage.clear();
            this.router.navigate(['/']);
        }
      }));
  }
}

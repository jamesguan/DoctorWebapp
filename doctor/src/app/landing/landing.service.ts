import { PLATFORM_ID, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser} from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'JWT'
  })
};

@Injectable()
export class LandingService {

  constructor(private http: HttpClient, private router: Router){

  }
  signIn(data): void{
    this.http.post('http://localhost:20000/auth', data, httpOptions)
    .subscribe(
      (data: any[]) => {
        localStorage.setItem("access_token", data.access_token);
        switch(data.type){
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'doctor':
            this.router.navigate(['/doctor']);
            break;
        }
      }
    );
  }
}

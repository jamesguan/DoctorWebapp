import { Component } from '@angular/core';
import { LandingService } from './landing.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  title = 'Willhelm International';
  constructor(private landingService: LandingService){}
  onSubmit(f: NgForm): void {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
    this.landingService.signIn(f.value);
  }
}

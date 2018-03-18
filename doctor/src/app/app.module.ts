import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';


import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';

import { DoctorComponent } from './doctor/doctor.component';
import { LandingComponent } from './landing/landing.component';
import { LandingService } from './landing/landing.service';
const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'doctor', component: DoctorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DoctorComponent,
    LandingComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatExpansionModule,
    MatGridListModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    AdminService,
    LandingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

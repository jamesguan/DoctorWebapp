import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './admin/admin.service';

import { DoctorComponent } from './doctor/doctor.component';

import { LandingComponent } from './landing/landing.component';
import { LandingService } from './landing/landing.service';

import { PatientComponent } from './patient/patient.component';
import { PatientService } from './patient/patient.service';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'patient', component: PatientComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DoctorComponent,
    LandingComponent,
    PatientComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    AdminService,
    LandingService,
    PatientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

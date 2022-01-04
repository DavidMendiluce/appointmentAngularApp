import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SignupComponent } from './signup/signup.component';
import { SuccessPageComponent } from './success-page/success-page.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'main/:userId', component: MainPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'adminPanel', component: AdminPanelComponent},
  {path: 'search/:location/:fromDate/:toDate/:adultGuests/:childrenGuests', component: SearchPageComponent},
  {path: 'searchByCountry/:location', component: SearchPageComponent},
  {path: 'searchByType/:type', component: SearchPageComponent},
  {path: 'details/:id/:price/:location/:fromDate/:toDate/:adultGuests/:childrenGuests', component: ReservationDetailsComponent},
  {path: 'form/:id/:price/:location/:type/:fromDate/:toDate/:adultGuests/:childrenGuests', component:  ReservationFormComponent},
  {path: 'success', component:  SuccessPageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

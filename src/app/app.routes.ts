import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'navbar', component:NavbarComponent},
  { path: 'accueil', component:LandingComponent}


];

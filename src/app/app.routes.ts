import { DeclarationformComponent } from './components/declarationform/declarationform.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Routes } from '@angular/router';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { PublishformComponent } from './components/publishform/publishform.component';

export const routes: Routes = [
  { path: 'navbar', component:NavbarComponent},
  { path: 'accueil', component:LandingComponent},
  { path: 'connexion', component:LoginComponent},
  { path: 'inscription', component: RegisterComponent},
  { path: 'publier', component: PublishformComponent},
  { path: 'liste', component: DocumentListComponent},
  { path: 'details', component: DocumentDetailComponent},
  { path: 'declarer', component: DeclarationformComponent},
  { path: 'document/:id', component: DocumentDetailComponent }, // Récupère l'ID depuis l'URL 


];

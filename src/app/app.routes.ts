import { DeclarationformComponent } from './components/declarationform/declarationform.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Routes } from '@angular/router';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { PublishformComponent } from './components/publishform/publishform.component';
import { MypublishComponent } from './components/mypublish/mypublish.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'navbar', component:NavbarComponent},
  { path: 'accueil', component:LandingComponent},
  { path: 'connexion', component:LoginComponent},
  { path: 'inscription', component: RegisterComponent},
  { path: 'publier', component: PublishformComponent,canActivate: [AuthGuard]},
  { path: 'liste', component: DocumentListComponent},
  { path: 'details', component: DocumentDetailComponent ,canActivate: [AuthGuard]},
  { path: 'declarer', component: DeclarationformComponent ,canActivate: [AuthGuard]},
  { path: 'document/:id', component: DocumentDetailComponent ,canActivate: [AuthGuard] },
  { path:  'mypub', component:MypublishComponent ,canActivate: [AuthGuard] },


];

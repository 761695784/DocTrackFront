import { AdminComponent } from './components/admin/admin.component';
import { LostdeclarationComponent } from './components/lostdeclaration/lostdeclaration.component';
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
import { ChangeprofilComponent } from './components/changeprofil/changeprofil.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SideheadersComponent } from './components/sideheaders/sideheaders.component';
import { AdminpubComponent } from './components/adminpub/adminpub.component';
import { AdmindetailsComponent } from './components/admindetails/admindetails.component';
import { AdmindeclarationComponent } from './components/admindeclaration/admindeclaration.component';
import { UsergetComponent } from './components/userget/userget.component';

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
  { path: 'mypub', component:MypublishComponent ,canActivate: [AuthGuard] },
  { path: 'lost', component:LostdeclarationComponent ,canActivate: [AuthGuard] },
  { path: 'modify', component:ChangeprofilComponent ,canActivate: [AuthGuard]},
  { path: 'sidebar', component:SidebarComponent },
  { path: 'head', component: SideheadersComponent},
  { path : 'admin', component: AdminComponent ,canActivate: [AuthGuard]},
  { path: 'adminpub', component: AdminpubComponent ,canActivate: [AuthGuard]},
  { path: 'admindetails/:id', component:AdmindetailsComponent ,canActivate: [AuthGuard]},
  { path: 'admindec', component:AdmindeclarationComponent, canActivate: [AuthGuard]},
  { path: 'adminuser', component: UsergetComponent, canActivate: [AuthGuard]},


];

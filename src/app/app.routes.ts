import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { PublishformComponent } from './components/publishform/publishform.component';
import { DeclarationformComponent } from './components/declarationform/declarationform.component';
import { LostdeclarationComponent } from './components/lostdeclaration/lostdeclaration.component';
import { MypublishComponent } from './components/mypublish/mypublish.component';
import { ChangeprofilComponent } from './components/changeprofil/changeprofil.component';
import { EvolutionChartComponent } from './components/evolution-chart/evolution-chart.component';
import { RestitutionChartComponent } from './components/restitution-chart/restitution-chart.component';
import { PublicationTypeChartComponent } from './components/publication-type-chart/publication-type-chart.component';
import { EmailActivityChartComponent } from './components/email-activity-chart/email-activity-chart.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminpubComponent } from './components/adminpub/adminpub.component';
import { AdmindetailsComponent } from './components/admindetails/admindetails.component';
import { AdmindeclarationComponent } from './components/admindeclaration/admindeclaration.component';
import { UsergetComponent } from './components/userget/userget.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { AdminprofilComponent } from './components/adminprofil/adminprofil.component';
import { AdminstatsComponent } from './components/adminstats/adminstats.component';
import { AProposComponent } from './components/a-propos/a-propos.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NewpassComponent } from './components/newpass/newpass.component';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'accueil', component: LandingComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'liste', component: DocumentListComponent },
  { path: 'apropos', component: AProposComponent},
  { path: 'reset',component: ResetPasswordComponent},
  { path: 'newpass', component: NewpassComponent },
  { path: 'private-policy', component: PrivatePolicyComponent },

  // Routes avec Authentification pour un user simple
  { path: 'publier', component: PublishformComponent, canActivate: [AuthGuard] },
  { path: 'document/:id', component: DocumentDetailComponent, canActivate: [AuthGuard] },
  { path: 'declarer', component: DeclarationformComponent, canActivate: [AuthGuard] },
  { path: 'lost', component: LostdeclarationComponent, canActivate: [AuthGuard] },
  { path: 'mypub', component: MypublishComponent, canActivate: [AuthGuard] },
  { path: 'modify', component: ChangeprofilComponent, canActivate: [AuthGuard] },

  // Routes pour un Administrateur
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AdminComponent },
      { path: 'profil', component: AdminprofilComponent },
      { path: 'adminpub', component: AdminpubComponent },
      { path: 'admindec', component: AdmindeclarationComponent },
      { path: 'adminuser', component: UsergetComponent },
      { path: 'adminadd', component: UserAddComponent },
      { path: 'adminstats', component: AdminstatsComponent },
      { path: 'admindetails/:id', component: AdmindetailsComponent }
    ]
  },

  // Routes pour les differents diagrammes
  { path: 'statistiques', component: EvolutionChartComponent, canActivate: [AuthGuard] },
  { path: 'restitution', component: RestitutionChartComponent, canActivate: [AuthGuard] },
  { path: 'publication-types', component: PublicationTypeChartComponent, canActivate: [AuthGuard] },
  { path: 'email-activity', component: EmailActivityChartComponent, canActivate: [AuthGuard] },

  // Lazy Loading pour la carte
  {
    path: 'map',
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent)
  }
];

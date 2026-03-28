import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // ══════════════════════════════════════════
  // Pages publiques — chargées immédiatement
  // ══════════════════════════════════════════
  { path: '', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'accueil', redirectTo: '', pathMatch: 'full' }, // ← évite le doublon
  { path: 'connexion', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'inscription', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'liste', loadComponent: () => import('./components/document-list/document-list.component').then(m => m.DocumentListComponent) },
  { path: 'apropos', loadComponent: () => import('./components/a-propos/a-propos.component').then(m => m.AProposComponent) },
  { path: 'reset', loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'newpass', loadComponent: () => import('./components/newpass/newpass.component').then(m => m.NewpassComponent) },
  { path: 'private-policy', loadComponent: () => import('./components/private-policy/private-policy.component').then(m => m.PrivatePolicyComponent) },
  { path: 'found-qr', loadComponent: () => import('./components/found-qr/found-qr.component').then(m => m.FoundQrComponent) },

  // ══════════════════════════════════════════
  // Pages protégées — user connecté
  // ══════════════════════════════════════════
  { path: 'publier', loadComponent: () => import('./components/publishform/publishform.component').then(m => m.PublishformComponent), canActivate: [AuthGuard] },
  { path: 'document/:uuid', loadComponent: () => import('./components/document-detail/document-detail.component').then(m => m.DocumentDetailComponent), canActivate: [AuthGuard] },
  { path: 'declarer', loadComponent: () => import('./components/declarationform/declarationform.component').then(m => m.DeclarationformComponent), canActivate: [AuthGuard] },
  { path: 'lost', loadComponent: () => import('./components/lostdeclaration/lostdeclaration.component').then(m => m.LostdeclarationComponent), canActivate: [AuthGuard] },
  { path: 'mypub', loadComponent: () => import('./components/mypublish/mypublish.component').then(m => m.MypublishComponent), canActivate: [AuthGuard] },
  { path: 'modify', loadComponent: () => import('./components/changeprofil/changeprofil.component').then(m => m.ChangeprofilComponent), canActivate: [AuthGuard] },
  { path: 'code', loadComponent: () => import('./components/qrcode/qrcode.component').then(m => m.QrcodeComponent), canActivate: [AuthGuard] },

  // ══════════════════════════════════════════
  // Pages admin — lazy loaded + protégées
  // ══════════════════════════════════════════
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent) },
      { path: 'profil', loadComponent: () => import('./components/adminprofil/adminprofil.component').then(m => m.AdminprofilComponent) },
      { path: 'adminpub', loadComponent: () => import('./components/adminpub/adminpub.component').then(m => m.AdminpubComponent) },
      { path: 'admindec', loadComponent: () => import('./components/admindeclaration/admindeclaration.component').then(m => m.AdmindeclarationComponent) },
      { path: 'adminuser', loadComponent: () => import('./components/userget/userget.component').then(m => m.UsergetComponent) },
      { path: 'adminadd', loadComponent: () => import('./components/user-add/user-add.component').then(m => m.UserAddComponent) },
      { path: 'adminstats', loadComponent: () => import('./components/adminstats/adminstats.component').then(m => m.AdminstatsComponent) },
      { path: 'admindetails/:uuid', loadComponent: () => import('./components/admindetails/admindetails.component').then(m => m.AdmindetailsComponent) },
      { path: 'admincertif', loadComponent: () => import('./components/admincertif/admincertif.component').then(m => m.AdmincertifComponent) },
      { path: 'adminlogs', loadComponent: () => import('./components/adminlogs/adminlogs.component').then(m => m.AdminlogsComponent) },
      { path: 'adminbackup', loadComponent: () => import('./components/adminbackup/adminbackup.component').then(m => m.AdminbackupComponent) },
      { path: 'adminrapport', loadComponent: () => import('./components/adminrapport/adminrapport.component').then(m => m.AdminrapportComponent) },
    ]
  },

  // ══════════════════════════════════════════
  // Diagrammes — déjà lazy loaded
  // ══════════════════════════════════════════
  { path: 'statistiques', loadComponent: () => import('./components/evolution-chart/evolution-chart.component').then(m => m.EvolutionChartComponent), canActivate: [AuthGuard] },
  { path: 'restitution', loadComponent: () => import('./components/restitution-chart/restitution-chart.component').then(m => m.RestitutionChartComponent), canActivate: [AuthGuard] },
  { path: 'publication-types', loadComponent: () => import('./components/publication-type-chart/publication-type-chart.component').then(m => m.PublicationTypeChartComponent), canActivate: [AuthGuard] },
  { path: 'email-activity', loadComponent: () => import('./components/email-activity-chart/email-activity-chart.component').then(m => m.EmailActivityChartComponent), canActivate: [AuthGuard] },
  { path: 'map', loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent) },

];

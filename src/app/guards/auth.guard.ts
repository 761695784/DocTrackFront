import { RedirectService } from './../components/services/redirection.service';
import { AuthService } from './../components/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private redirectService: RedirectService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authService.isAuthenticated()) {
      // Vérification du rôle Admin
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const roles = user.roles || [];

      // Chercher si le rôle Admin existe
      const isAdmin = roles.some((role: any) => role.name === 'Admin');

      console.log('Rôle de l\'utilisateur:', roles); // Vérifier tous les rôles
      console.log('Est admin:', isAdmin); // Vérifier si l'utilisateur est admin

      if (next.routeConfig?.path === 'admin' && !isAdmin) {
        // Si l'utilisateur n'est pas admin, rediriger vers la page d'accueil
        this.router.navigate(['/accueil']);
        return false;
      }

      return true;
    } else {
      // Stocker l'URL à laquelle l'utilisateur tentait d'accéder
      this.redirectService.setRedirectUrl(state.url);
      this.router.navigate(['/connexion']); // Rediriger vers la page de connexion
      return false;
    }
  }

}

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
      return true;
    } else {
      // Stocker l'URL à laquelle l'utilisateur tentait d'accéder
      this.redirectService.setRedirectUrl(state.url);
      this.router.navigate(['/connexion']); // Rediriger vers la page de connexion
      return false;
    }
  }
}

import { RedirectService } from './redirection.service';
import { User } from '../register/register.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    public router: Router,
    private redirectService: RedirectService // Injection du RedirectService
  ) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }


// Connexion
login(credentials: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.apiUrl}/login`, credentials, { headers }).pipe(
    tap((response: any) => {
      if (response.token) {
        localStorage.setItem('token', response.token); // stocker le token
        localStorage.setItem('user', JSON.stringify(response.user)); // stocker les informations de l'utilisateur
        localStorage.setItem('userId', response.user.id); // Assurez-vous de stocker le bon userId

        // Rediriger l'utilisateur vers l'URL qu'il a demandée
        const redirectUrl = this.redirectService.getRedirectUrl();
        this.redirectService.clearRedirectUrl(); // Effacer l'URL
        this.router.navigate([redirectUrl || '/accueil']); // Rediriger vers l'URL d'origine ou une route par défaut
      }
    })
  );
}


  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        return !!token;
    }
    return false; // Retourne false si l'environnement est non-navigateur
}
      getUserName(): string {
        // Récupérer les informations de l'utilisateur depuis le localStorage ou le token JWT
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.FirstName || 'Utilisateur';
      }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

   updateProfile(profileData: any): Observable<any> {
    // const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    return this.http.put(`${this.apiUrl}/profil`, profileData, { headers });
  }

  changePassword(passwordData: any): Observable<any> {
    // const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    return this.http.put(`${this.apiUrl}/change-password`, passwordData, { headers });
  }
}

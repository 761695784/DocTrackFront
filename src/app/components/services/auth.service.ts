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
  private apiUrl = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api';
  private apiUrlGetAll = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api' ;
  private apiUrlPost = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/'; // URL pour ajouter des documents


  constructor(
    private http: HttpClient,
    public router: Router,
    private redirectService: RedirectService // Injection du RedirectService
  ) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // stocker le token
          localStorage.setItem('user', JSON.stringify(response.user)); // stocker les informations de l'utilisateur
          localStorage.setItem('userId', response.user.id); // stocker l'ID de l'utilisateur

          // Rediriger en fonction du rôle de l'utilisateur
          const roles = response.user.roles || []; // Assurez-vous que l'API renvoie les rôles de l'utilisateur
          const isAdmin = roles.some((role: any) => role.name === 'Admin');

          if (isAdmin) {
            this.router.navigate(['/admin']); // Redirection pour l'admin
          } else {
            // Rediriger l'utilisateur vers l'URL qu'il a demandée ou vers /accueil
            const redirectUrl = this.redirectService.getRedirectUrl();
            this.redirectService.clearRedirectUrl(); // Effacer l'URL
            this.router.navigate([redirectUrl || '/accueil']); // Redirection pour utilisateur simple
          }
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
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    return this.http.put(`${this.apiUrl}/profil`, profileData, { headers });
  }

  changePassword(passwordData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    return this.http.put(`${this.apiUrl}/change-password`, passwordData, { headers });
  }

    // Nouvelle méthode pour récupérer tous les utilisateurs avec leurs rôles
    getAllUsers(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${this.apiUrlGetAll}/users`, { headers });
    }

    // Nouvelle méthode pour supprimer un utilisateur
    deleteUser(id: number): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.delete(`${this.apiUrlGetAll}/users/${id}`, { headers });
    }

    addUser(userData: any): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.post(`${this.apiUrlPost}/create-admin`, userData, { headers });
    }

    // Dans votre service Angular (AuthService)

    getAllEmailLogs(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${this.apiUrl}/emails`, { headers }); // Assurez-vous que l'URL correspond à votre API
    }

    getAllData(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${this.apiUrl}/notification`, { headers }); // Assurez-vous que l'URL correspond à votre API
    }

     // Récupère le nombre de demandes de restitution
    getRestitutionRequestCount(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${this.apiUrl}/restitution-count`, { headers }); // Assurez-vous que l'URL correspond à votre API
    }

}

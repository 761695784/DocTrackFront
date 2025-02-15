import { RedirectService } from './redirection.service';
import { User } from '../register/register.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,public router: Router,private redirectService: RedirectService) {}

  // loginWithGoogle(idToken: string): Observable<any> {
  //   return this.http.post(`${apiUrl}/auth/google`, { token: idToken });
  // }

  // finalizeGoogleAccount(data: any): Observable<any> {
  //   return this.http.post(`${apiUrl}/auth/google/finalize`, data);
  // }

    //methode pour recuperer toutes les notifications
    getAllNotifications(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${apiUrl}/notifications`, { headers });
    }

    // methode pour marquer que toutes les notifications sont lues
    markAllAsRead(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.post(`${apiUrl}/notifications/mark-all-as-read`, null, { headers });
    }

    // Methode pour marquer une notification comme lue
    markNotificationAsRead(notificationId: number): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.patch(`${apiUrl}/notifications/${notificationId}/mark-as-read`, null, { headers });
    }

    //Methode d'inscription d'un user simple
    register(user: User): Observable<any> {
      return this.http.post(`${apiUrl}/register`, user);
    }

    // Methode de Connexion d'un user
    login(credentials: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(`${apiUrl}/login`, credentials, { headers }).pipe(
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
      if (typeof window === 'undefined' || !window.localStorage) {
        return false; // Retourne false si l'environnement est non-navigateur
      }
      const token = localStorage.getItem('token');
      return !!token;
    }


    //Methode pour récupérer le Prénom de l'utilisateur connecté
    getUserName(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.FirstName || 'Utilisateur';
    }

    //Methode de la deconnexion
    logout(): void {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

    //methode pour la modifications des infos du profil
    updateProfile(profileData: any): Observable<any> {
      const userId = localStorage.getItem('userId');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.put(`${apiUrl}/profil`, profileData, { headers });
    }

    // Methode pour le changement de mot de passe
    changePassword(passwordData: any): Observable<any> {
      const userId = localStorage.getItem('userId');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.put(`${apiUrl}/change-password`, passwordData, { headers });
    }

    // Nouvelle méthode pour récupérer tous les utilisateurs avec leurs rôles
    getAllUsers(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${apiUrl}/users`, { headers });
    }

    // Nouvelle méthode pour supprimer un utilisateur
    deleteUser(id: number): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.delete(`${apiUrl}/users/${id}`, { headers });
    }

     // Nouvelle méthode pour ajouter un utilisateur admin
    addUser(userData: any): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.post(`${apiUrl}/create-admin`, userData, { headers });
    }

    // Methode d'affichage des historiques des mails envoyes
    getAllEmailLogs(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${apiUrl}/emails`, { headers });
    }

    //Methode pour recuperer les donnees concerant toutes les mails
    getAllData(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${apiUrl}/notification`, { headers });
    }

     // Récupère le nombre de demandes de restitution
    getRestitutionRequestCount(): Observable<any> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get(`${apiUrl}/restitution-count`, { headers });
    }

    // Methode pour envoyer un mail de reinitialisation du mot de passe oublié
    sendResetPasswordEmail(email: string): Observable<any> {
      return this.http.get(`${apiUrl}/forgot-password`, { params: { email } });
    }

    // Methode pour réinitialiser le mot de passe
    resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<any> {
      return this.http.post(`${apiUrl}/reset-password`, data);
    }

}

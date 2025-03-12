import { RedirectService } from './redirection.service';
import { User } from '../register/register.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, public router: Router, private redirectService: RedirectService) {}

  // Récupérer le profil utilisateur 
  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${apiUrl}/me`, { headers });
  }

  // Récupérer toutes les notifications 
  getAllNotifications(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${apiUrl}/notifications`, { headers });
  }

  // Marquer toutes les notifications comme lues 
  markAllAsRead(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.post(`${apiUrl}/notifications/mark-all-as-read`, null, { headers });
  }

  // Renouveler le QR code 
  renewQrCode(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé dans localStorage');
      return throwError('Aucun token disponible');
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${apiUrl}/renew-qr-code`, {}, { headers });
  }

  // Marquer une notification comme lue 
  markNotificationAsRead(notificationId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.patch(`${apiUrl}/notifications/${notificationId}/mark-as-read`, null, { headers });
  }

  // Inscription d'un utilisateur
  register(user: User): Observable<any> {
    return this.http.post(`${apiUrl}/register`, user);
  }

  // Connexion d'un utilisateur
  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('userId', response.user.id);
          const roles = response.user.roles || [];
          const isAdmin = roles.some((role: any) => role.name === 'Admin');
          if (isAdmin) {
            this.router.navigate(['/admin']);
          } else {
            const redirectUrl = this.redirectService.getRedirectUrl();
            this.redirectService.clearRedirectUrl();
            this.router.navigate([redirectUrl || '/accueil']);
          }
        }
      })
    );
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Récupérer le prénom de l'utilisateur
  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.FirstName || 'Utilisateur';
  }

  // Déconnexion 
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Modifier le profil 
  updateProfile(profileData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.put(`${apiUrl}/profil`, profileData, { headers });
  }

  // Changer le mot de passe 
  changePassword(passwordData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.put(`${apiUrl}/change-password`, passwordData, { headers });
  }

  // Récupérer tous les utilisateurs 
  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${apiUrl}/users`, { headers });
  }

  // Supprimer un utilisateur 
  deleteUser(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.delete(`${apiUrl}/users/${id}`, { headers });
  }

  // Ajouter un administrateur 
  addUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.post(`${apiUrl}/create-admin`, userData, { headers });
  }

  // Récupérer tous les logs d'emails 
  getAllEmailLogs(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${apiUrl}/all-emails`, { headers });
  }

  // Récupérer toutes les données 
  getAllData(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${apiUrl}/all-notifications`, { headers });
  }

  // Récupérer le nombre de demandes de restitution 
  getRestitutionRequestCount(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${apiUrl}/restitution-count`, { headers });
  }

  // Envoyer un email de réinitialisation de mot de passe 
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.get(`${apiUrl}/forgot-password`, { params: { email } });
  }

  // Réinitialiser le mot de passe 
  resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<any> {
    return this.http.post(`${apiUrl}/reset-password`, data);
  }
}
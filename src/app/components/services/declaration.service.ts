import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les déclarations de l'utilisateur connecté
  getUserDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<any[]>(`${apiUrl}/mydec`, { headers });
  }

  // Ajouter une déclaration
  addDeclaration(declaration: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    // Utilisation de FormData pour envoyer les données
    return this.http.post<any>(`${apiUrl}/declarations`, declaration, { headers }).pipe(
      tap(response => {
        // console.log('Réponse du serveur:', response);
      })
    );
  }

  // Afficher toutes les déclarations pour l'admin uniquement
  getAllDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<any[]>(`${apiUrl}/declarations`, { headers });
  }

  // Supprimer une déclaration
  deleteDeclaration(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.delete(`${apiUrl}/declarations/${id}`, { headers });
  }

  // Récupérer les déclarations supprimées de l'utilisateur connecté
  getTrashedDeclarations(): Observable<{ success: boolean; message: string; data: any[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<{ success: boolean; message: string; data: any[] }>(`${apiUrl}/trash`, { headers });
  }

  // Restaurer une déclaration supprimée
  restoreDeclaration(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post(`${apiUrl}/declarations/restore/${id}`, {}, { headers });
  }

}

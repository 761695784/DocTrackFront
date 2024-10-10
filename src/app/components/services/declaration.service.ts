import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {

    private apiUrl = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api'; // URL de base pour les déclarations

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les déclarations de l'utilisateur connecté
  getUserDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/mydec`, { headers }); // Route spécifique pour les déclarations de l'utilisateur
  }

  // Ajouter une déclaration
addDeclaration(declaration: FormData): Observable<any> {
  const token = localStorage.getItem('token'); // récupère le token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}` // ajoute l'en-tête d'authentification
  });

  // Utilisation de FormData pour envoyer les données
  return this.http.post<any>(`${this.apiUrl}/declarations`, declaration, { headers }).pipe( // Remplacez {} par declaration
    tap(response => {
      // console.log('Réponse du serveur:', response);
    })
  );
}


  // Afficher toutes les déclarations pour l'admin uniquement
  getAllDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/declarations`, { headers }); // Utilise la même URL de base
  }

  // Supprimer une déclaration
  deleteDeclaration(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/declarations/${id}`, { headers }); // Route spécifique pour la suppression
  }
}

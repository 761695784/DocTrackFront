import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  private apiUrlGet = 'http://localhost:8000/api/declarations'; // URL pour récupérer les déclarations
  private apiUrlPost = 'http://localhost:8000/api/declarations'; // URL pour ajouter des déclarations

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les déclarations
  getAllDeclarations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlGet);
  }

  // Ajouter une déclaration
  addDeclaration(declaration: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // ajoute l'en-tête d'authentification
    });

    // Utilisation de FormData pour envoyer les données
    return this.http.post<any>(this.apiUrlPost, declaration, { headers }).pipe(
      tap(response => {
        console.log('Réponse du serveur:', response);
      })
    );
  }
}

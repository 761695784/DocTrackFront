import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Chemin correct vers AuthService
import { Document } from '../document-list/document-list.component';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {
  private apiUrlGet = 'http://localhost:8000/api/document'; // URL pour récupérer les documents
  private apiUrlPost = 'http://localhost:8000/api/documents'; // URL pour ajouter des documents

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrlGet).pipe(
      map(documents => documents.map(doc => {
        doc.image = doc.image ? `http://localhost:8000/storage/public/documents/${doc.image}` : '';
        return doc;
      }))
    );
  }

  // Ajouter une publication
  addPublication(document: FormData): Observable<Document> {
    const token = localStorage.getItem('token'); // récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // ajoute l'en-tête d'authentification
    });

    // Utilisation de FormData pour envoyer le fichier et les autres champs
    return this.http.post<Document>(this.apiUrlPost, document, { headers }).pipe(
      tap(response => {
        // Effectuez éventuellement d'autres actions ici avec la réponse
        console.log('Réponse du serveur:', response);
      })
    );
  }
}

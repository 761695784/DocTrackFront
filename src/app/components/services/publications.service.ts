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
  private apiUrlGetAll = 'http://localhost:8000/api/document'; // URL pour récupérer tous les documents
  private apiUrlGetUser = 'http://localhost:8000/api/mypub'; // URL pour récupérer uniquement les documents de l'utilisateur connecté
  private apiUrlPost = 'http://localhost:8000/api/documents'; // URL pour ajouter des documents

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrlGetAll).pipe(
      map(documents => documents.map(doc => {
        doc.image = doc.image ? `http://localhost:8000${doc.image}` : '';
        return doc;
      }))
    );
  }

  getUserPublications(): Observable<Document[]> {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<Document[]>(this.apiUrlGetUser, { headers });
    }
    return new Observable<Document[]>(observer => {
        observer.error('Non-navigateur : impossible de récupérer les publications utilisateur');
    });
}

addPublication(document: FormData): Observable<Document> {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<Document>(this.apiUrlPost, document, { headers }).pipe(
            tap(response => {
                console.log('Réponse du serveur:', response);
            })
        );
    }
    return new Observable<Document>(observer => {
        observer.error('Non-navigateur : impossible d\'ajouter une publication');
    });
}

}

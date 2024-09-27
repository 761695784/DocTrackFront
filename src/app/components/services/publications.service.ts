import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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
  private apiUrlDelete = 'http://localhost:8000/api/document'; // URL pour supprimer des documents
  private apiUrlUpdate = 'http://localhost:8000/api/document'; // URL pour mettre à jour des documents

  private publicationsSubject = new BehaviorSubject<Document[]>([]);
  public publications$ = this.publicationsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrlGetAll).pipe(
      tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
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

  deletePublication(id: number): Observable<void> {
    const token = localStorage.getItem('token'); // obtenir le token d'authentification
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrlDelete}/${id}`, { headers });
}

  updatePublicationStatus(id: number, statut: string): Observable<{ success: boolean; message: string; document: Document }> {
      const token = localStorage.getItem('token'); // Obtenez le token d'authentification
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });

      return this.http.put<{ success: boolean; message: string; document: Document }>(
          `${this.apiUrlUpdate}/${id}`,
          { statut },
          { headers } // Ajoutez les en-têtes ici
      ).pipe(
          tap((response) => {
              // Met à jour le sujet avec le nouveau statut après la réponse
              const updatedDocuments = this.publicationsSubject.value.map(doc =>
                  doc.id === id ? { ...doc, statut: response.document.statut } : doc
              );
              this.publicationsSubject.next(updatedDocuments);
          })
      );
  }
}

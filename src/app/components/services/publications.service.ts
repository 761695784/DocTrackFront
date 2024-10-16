import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Chemin correct vers AuthService
import { Document } from '../document-list/document-list.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { apiUrl } from './apiUrl'; // Chemin correct vers apiUrl.ts

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {



  private publicationsSubject = new BehaviorSubject<Document[]>([]);
  public publications$ = this.publicationsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(`${apiUrl}/document`).pipe(
      tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
      map(documents => documents.map(doc => {
        // doc.image = doc.image ? `http://localhost:8000${doc.image}` : '';
        doc.image = doc.image ? `https://doctrackapi.malang2019marna.simplonfabriques.com${doc.image}` : '';

        return doc;
      }))
    );
  }

  getPublicationsByType(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/doctype`, { headers });
  }

// Récupérer toutes les publications (y compris supprimées)

getAllDocumentsIncludingDeleted(): Observable<Document[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  return this.http.get<Document[]>(`${apiUrl}/all`, { headers }).pipe(
    tap(response => console.log('Réponse du serveur:', response)),
    map(documents => {
      // On s'assure que chaque document a l'URL correcte pour l'image
      return documents.map(doc => {
        //  doc.image = doc.image ? `https://doctrackapi.malang2019marna.simplonfabriques.com${doc.image}` : '';
        doc.image = doc.image ? `http://localhost:8000${doc.image}` : '';
        return doc;
      });
    }),
    catchError(err => {
      console.error('Erreur lors de la récupération des documents', err);
      return ([]); // Retourne un tableau vide en cas d'erreur
    })
  );


}



  // Méthode d'affichage des publications d'un utilisateur spécifique
  getUserPublications(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/mypub`, { headers });
  }

  // Méthode pour ajouter une publication
  addPublication(document: FormData): Observable<Document> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<Document>(`${apiUrl}/documents`, document, { headers }).pipe(
      tap(response => {
        // Logique après l'ajout de la publication
      })
    );
  }


   // Méthode pour la suppression d'une publication
  deletePublication(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete<void>(`${apiUrl}/document/${id}`, { headers });
  }

  // Récupérer les documents supprimés (soft deleted)
  getTrashedDocuments(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Authentification avec JWT
    });
    return this.http.get<Document[]>(`${apiUrl}/trashed`, { headers });
  }

  // Restaurer un document supprimé
  restoreDocument(id: number): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Authentification avec JWT
    });
    return this.http.post<{ success: boolean; message: string }>(`${apiUrl}/documents/restore/${id}`, {}, { headers });
  }


 // Méthode pour la modification du statut de sa propre publication
    updatePublicationStatus(id: number, statut: string): Observable<{ success: boolean; message: string; document: Document }> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.put<{ success: boolean; message: string; document: Document }>(
        `${apiUrl}/document/${id}`,
        { statut },
        { headers }
      ).pipe(
        tap(response => {
          const updatedDocuments = this.publicationsSubject.value.map(doc =>
            doc.id === id ? { ...doc, statut: response.document.statut } : doc
          );
          this.publicationsSubject.next(updatedDocuments);
        })
      );
    }


}

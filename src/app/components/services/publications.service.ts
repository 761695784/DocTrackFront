import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Document } from '../document-list/document-list.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { apiUrl } from './apiUrl';
import { IMAGE_URL_BASE } from './imageUrl';
import { Location } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private publicationsSubject = new BehaviorSubject<Document[]>([]);
  public publications$ = this.publicationsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les documents supprimés
  getDeletedDocuments(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/deleted-documents`, { headers }).pipe(
      tap(documents => this.publicationsSubject.next(documents)),
      map(documents => documents.map(doc => {
        doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : '';
        return doc;
      })),
      catchError(this.handleError)
    );
  }

  // Récupérer les documents "récupérés" 
  getRecoveredDocuments(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/recovered-documents`, { headers }).pipe(
      tap(documents => this.publicationsSubject.next(documents)),
      map(documents => documents.map(doc => {
        doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : '';
        return doc;
      })),
      catchError(this.handleError)
    );
  }

  // Récupérer les documents "non récupérés" 
  getNotRecoveredDocuments(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/not-recovered-documents`, { headers }).pipe(
      tap(documents => this.publicationsSubject.next(documents)),
      map(documents => documents.map(doc => {
        doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : '';
        return doc;
      })),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs 
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error('Une erreur est survenue, veuillez réessayer plus tard.'));
  }

  // Récupérer toutes les publications pour un SimpleUser 
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(`${apiUrl}/document`).pipe(
      tap(documents => this.publicationsSubject.next(documents)),
      map(documents => documents.map(doc => {
        doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : '';
        return doc;
      }))
    );
  }

  // Récupérer toutes les publications y compris supprimées pour l'admin 
  getAllDocumentsIncludingDeleted(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/all-publications`, { headers }).pipe(
      tap(response => console.log('Réponse du serveur:', response)),
      map(documents => {
        return documents.map(doc => {
          doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : '';
          return doc;
        });
      }),
      catchError(err => {
        console.error('Erreur lors de la récupération des documents', err);
        return ([]);
      })
    );
  }

  // Récupérer les documents supprimés 
  getTrashedDocuments(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<{ data: Document[] }>(`${apiUrl}/trashed`, { headers }).pipe(
      map(response => {
        const trashedDocuments: Document[] = Array.isArray(response.data) ? response.data : [];
        trashedDocuments.forEach((doc: Document) => {
          doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : '';
        });
        return trashedDocuments;
      }),
      catchError(error => throwError(error))
    );
  }

  // Récupérer les publications d'un utilisateur
  getUserPublications(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/my-publications`, { headers }).pipe(
      map(publications => publications.map(pub => {
        pub.image = pub.image ? `${IMAGE_URL_BASE}${pub.image}` : '';
        return pub;
      }))
    );
  }

  // Diagramme en barre : publications par type 
  getPublicationsByType(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/publications-by-type`, { headers });
  }

  // Diagramme en barre : nombre de publications par statut 
  getDocumentStatusCount(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/status-count`, { headers });
  }

  // Diagramme circulaire : demandes de restitution 
  getRestitutionData(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/restitution-data`, { headers });
  }

  // Diagramme en barre : nombre de mails envoyés
  getEmailActivity(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/email-activity`, { headers });
  }

  // Courbe d'évolution 
  getEvolutionData(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${apiUrl}/statistics`, { headers });
  }

  // Publications par lieu 
  getPublicationsByLocation(): Observable<Location[]> {
    return this.http.get<Location[]>(`${apiUrl}/lieu`).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération des données :", error);
        return throwError(error);
      })
    );
  }

  // Ajouter une publication 
  addPublication(document: FormData): Observable<Document> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<Document>(`${apiUrl}/documents`, document, { headers }).pipe(
      tap(response => {
        // Logique après l'ajout de la publication
      })
    );
  }

  // Supprimer une publication
  deletePublication(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete<void>(`${apiUrl}/documents/${id}`, { headers });
  }

  // Restaurer un document supprimé 
  restoreDocument(uuid: string): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<{ success: boolean; message: string }>(`${apiUrl}/documents/restore/${uuid}`, {}, { headers });
  }

  // Modifier le statut d'une publication
  updatePublicationStatus(uuid: string, statut: string): Observable<{ success: boolean; message: string; document: Document }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put<{ success: boolean; message: string; document: Document }>(
      `${apiUrl}/documents/${uuid}`, { statut }, { headers }
    ).pipe(
      tap(response => {
        const updatedDocuments = this.publicationsSubject.value.map(doc =>
          doc.uuid === uuid ? { ...doc, statut: response.document.statut } : doc
        );
        this.publicationsSubject.next(updatedDocuments);
      })
    );
  }
}
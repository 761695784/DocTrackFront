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
  private apiUrl = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api';
  // private apiUrl = 'http://localhost:8000/api';
  // https://doctrackapi.malang2019marna.simplonfabriques.com/api



  private publicationsSubject = new BehaviorSubject<Document[]>([]);
  public publications$ = this.publicationsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/document`).pipe(
      tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
      map(documents => documents.map(doc => {
        // doc.image = doc.image ? `http://localhost:8000${doc.image}` : '';
        doc.image = doc.image ? `https://doctrackapi.malang2019marna.simplonfabriques.com${doc.image}` : '';

        return doc;
      }))
    );
  }


  // Méthode d'affichage des publications d'un utilisateur spécifique
  getUserPublications(): Observable<Document[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Document[]>(`${this.apiUrl}/mypub`, { headers });
  }

  // Méthode pour ajouter une publication
  addPublication(document: FormData): Observable<Document> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<Document>(`${this.apiUrl}/documents`, document, { headers }).pipe(
      tap(response => {
        // Logique après l'ajout de la publication
      })
    );
  }


   // Méthode pour la suppression d'une publication
  deletePublication(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiUrl}/document/${id}`, { headers });
  }

 // Méthode pour la modification du statut de sa propre publication
 updatePublicationStatus(id: number, statut: string): Observable<{ success: boolean; message: string; document: Document }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  return this.http.put<{ success: boolean; message: string; document: Document }>(
    `${this.apiUrl}/document/${id}`,
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

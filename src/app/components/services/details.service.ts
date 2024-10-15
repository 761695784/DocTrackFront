import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDetails } from '../document-detail/document-detail.component';
import { apiUrl } from './apiUrl'; // Chemin correct vers apiUrl.ts
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private http: HttpClient) {}

  // Récupérer les détails d'une publication par son ID
  getDocumentDetails(id: number): Observable<DocumentDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DocumentDetails>(`${apiUrl}/documents/${id}`, { headers }).pipe(
      catchError((error) => {
        return throwError(error); // Propager l'erreur pour le traitement dans le composant
      })
    );
  }

  requestRestitution(documentId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoute l'en-tête d'authentification
    });
    return this.http.post<any>(`${apiUrl}/documents/${documentId}/restitution`, {}, { headers });
  }

}

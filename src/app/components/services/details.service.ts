import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDetails } from '../document-detail/document-detail.component';
import { apiUrl } from './apiUrl'; // Chemin correct vers apiUrl.ts

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  // private apiUrl = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/documents'; // URL de l'API pour les publications
  // private apiUrl = 'http://localhost:8000/api/documents';

  constructor(private http: HttpClient) {}

  // Récupérer les détails d'une publication par son ID
  getDocumentDetails(id: number): Observable<DocumentDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DocumentDetails>(`${apiUrl}/documents/${id}`, { headers });
  }

  requestRestitution(documentId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoute l'en-tête d'authentification
    });
    return this.http.post<any>(`${apiUrl}/documents/${documentId}/restitution`, {}, { headers });
  }

}

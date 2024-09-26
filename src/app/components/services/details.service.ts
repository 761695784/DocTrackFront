import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDetails } from '../document-detail/document-detail.component'; // Assurez-vous d'utiliser le type DocumentDetails correcte pour les détails du document

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private apiUrl = 'http://localhost:8000/api/documents'; // URL de l'API pour les publications

  constructor(private http: HttpClient) {}

  // Récupérer les détails d'une publication par son ID
  getDocumentDetails(id: number): Observable<DocumentDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DocumentDetails>(`${this.apiUrl}/${id}`, { headers });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../document-list/document-list.component';
import { map } from 'rxjs/operators'; // Ajoutez cette ligne

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private apiUrl = 'http://localhost:8000/api/document';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl).pipe(
      map(documents => documents.map(doc => {
        doc.image = `http://localhost:8000/api/document/${doc.image}`; // ajustez selon votre API
        return doc;
      }))
    );
  }

  // Ajouter une publication
  addPublication(document: Document): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, document);
  }

  // Autres méthodes (modifier, supprimer, etc.) selon tes besoins
}

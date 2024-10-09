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
  private apiUrlGetAll = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/document'; // URL pour récupérer tous les documents
  private apiUrlGetUser = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/mypub'; // URL pour récupérer uniquement les documents de l'utilisateur connecté
  private apiUrlPost = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/documents'; // URL pour ajouter des documents
  private apiUrlDelete = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/document'; // URL pour supprimer des documents
  private apiUrlUpdate = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/document'; // URL pour mettre à jour des documents


  // private apiUrlGetAll = 'http://localhost:8000/api/document';
  // private apiUrlGetUser = 'http://localhost:8000/api/mypub';
  // private apiUrlPost = 'http://localhost:8000/api/documents';
  // private apiUrlDelete = 'http://localhost:8000/api/document';
  // private apiUrlUpdate = 'http://localhost:8000/api/document';

  // https://doctrackapi.malang2019marna.simplonfabriques.com/api



  private publicationsSubject = new BehaviorSubject<Document[]>([]);
  public publications$ = this.publicationsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer toutes les publications
  getAllPublications(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrlGetAll).pipe(
      tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
      map(documents => documents.map(doc => {
        // doc.image = doc.image ? `http://localhost:8000${doc.image}` : '';
        doc.image = doc.image ? `https://doctrackapi.malang2019marna.simplonfabriques.com${doc.image}` : '';

        return doc;
      }))
    );
  }


  //Methode d'affichage des pub d'un user specific
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


//Methode pour ajouter une publication
  addPublication(document: FormData): Observable<Document> {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<Document>(this.apiUrlPost, document, { headers }).pipe(
            tap(response => {
                // console.log('Réponse du serveur:', response);
            })
        );
    }
    return new Observable<Document>(observer => {
        observer.error('Non-navigateur : impossible d\'ajouter une publication');
    });
  }

  // Methode pour la suppression d'une publication
  deletePublication(id: number): Observable<void> {
    const token = localStorage.getItem('token'); // obtenir le token d'authentification
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrlDelete}/${id}`, { headers });
}

//methode pour la modification du statut de sa propre publication
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

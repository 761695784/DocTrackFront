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
      return this.http.get<Document[]>(`${apiUrl}/supp`, { headers }).pipe(
        tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
        map(documents => documents.map(doc => {
          doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : ''; // Utilise la constante d'URL d'image
          return doc;
        })),
        catchError(this.handleError)
      );
    }

    // Récupérer les documents "récupérés"
    getRecoveredDocuments(): Observable<Document[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get<Document[]>(`${apiUrl}/recup`, { headers }).pipe(
        tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
        map(documents => documents.map(doc => {
          doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : ''; // Utilise la constante d'URL d'image
          return doc;
        })),
        catchError(this.handleError)
      );
    }

    // Récupérer les documents "non récupérés"
    getNotRecoveredDocuments(): Observable<Document[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get<Document[]>(`${apiUrl}/nonrecup`, { headers }).pipe(
        tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
        map(documents => documents.map(doc => {
          doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : ''; // Utilise la constante d'URL d'image
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
    tap(documents => this.publicationsSubject.next(documents)), // Met à jour le sujet
    map(documents => documents.map(doc => {
      doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : ''; // Utilise la constante d'URL d'image
      return doc;
    }))
  );
}

// Fonction récupérant toutes les publications (y compris supprimées) pour l'admin
getAllDocumentsIncludingDeleted(): Observable<Document[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<Document[]>(`${apiUrl}/all`, { headers }).pipe(
    tap(response => console.log('Réponse du serveur:', response)),
    map(documents => {
      return documents.map(doc => {
        doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : ''; // Utilise la constante d'URL d'image
        return doc;
      });
    }),
    catchError(err => {
      console.error('Erreur lors de la récupération des documents', err);
      return ([]); // Retourne un tableau vide en cas d'erreur
    })
  );
}

// Récupérer les documents supprimés (soft deleted)
getTrashedDocuments(): Observable<Document[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  return this.http.get<{ data: Document[] }>(`${apiUrl}/trashed`, { headers }).pipe(
    map(response => {
      const trashedDocuments: Document[] = Array.isArray(response.data) ? response.data : [];
      trashedDocuments.forEach((doc: Document) => {
        doc.image = doc.image ? `${IMAGE_URL_BASE}${doc.image}` : ''; // Utilise la constante d'URL d'image
      });
      return trashedDocuments;
    }),
    catchError(error => throwError(error)) // Gestion de l'erreur
  );
}

// Méthode d'affichage des publications d'un utilisateur spécifique
getUserPublications(): Observable<Document[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<Document[]>(`${apiUrl}/mypub`, { headers }).pipe(
    map(publications => publications.map(pub => {
      pub.image = pub.image ? `${IMAGE_URL_BASE}${pub.image}` : ''; // Utilise la constante d'URL d'image
      return pub;
    }))
  );
}

      // Diagramme en barre montrant le nombre de publication selon le type de document
      getPublicationsByType(): Observable<Document[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Document[]>(`${apiUrl}/doctype`, { headers });
      }

      // Diagramme en barre mmontrant le nombre de pub dont le satut est recuperé par rapport aux non recupere
      getDocumentStatusCount(): Observable<Document[]>{
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Document[]>(`${apiUrl}/status-count`, { headers });
      }
    // Fonction pour le diagrame circulaire du demande de restitution par rapport aux publications restantes
      getRestitutionData(): Observable<Document[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Document[]>(`${apiUrl}/taux`, { headers });
      }

    // Fonction pour le diagramme en barre du nombre de mail envoyé
      getEmailActivity(): Observable<Document[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Document[]>(`${apiUrl}/mail`, { headers });
      }

      // Fonction pour la courbe d'evolution
      getEvolutionData(): Observable<Document[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Document[]>(`${apiUrl}/stat`, { headers });
      }

      //Methode pour afficher les pubications par lieux
      getPublicationsByLocation(): Observable<Location[]> {
        // const token = localStorage.getItem('token');
        // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get<Location[]>(`${apiUrl}/lieu`,).pipe(
          catchError(error => {
            console.error("Erreur lors de la récupération des données :", error);
            return throwError(error);
          })
        );
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



      // Restaurer un document supprimé
      restoreDocument(id: number): Observable<{ success: boolean; message: string }> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`});
        return this.http.post<{ success: boolean; message: string }>(`${apiUrl}/documents/restore/${id}`, {}, { headers });
      }

      // Méthode pour la modification du statut de sa propre publication
        updatePublicationStatus(id: number, statut: string): Observable<{ success: boolean; message: string; document: Document }> {
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
          return this.http.put<{ success: boolean; message: string; document: Document }>(
            `${apiUrl}/document/${id}`,{ statut },{ headers }).pipe(
            tap(response => {
              const updatedDocuments = this.publicationsSubject.value.map(doc =>
                doc.id === id ? { ...doc, statut: response.document.statut } : doc
              );
              this.publicationsSubject.next(updatedDocuments);
            })
          );
        }


}

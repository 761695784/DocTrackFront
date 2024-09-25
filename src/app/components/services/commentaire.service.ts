// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Commentaire } from '../document-detail/document-detail.component';

// @Injectable({
//   providedIn: 'root'
// })
// export class CommentairesService {
//   private apiUrl = 'http://localhost:8000/api/comments'; // URL pour les commentaires

//   constructor(private http: HttpClient) {}

//   // Récupérer les commentaires par document ID
//   getCommentairesByDocument(documentId: number): Observable<Commentaire[]> {
//     return this.http.get<Commentaire[]>(`http://localhost:8000/api/documents/${documentId}/comments`);
//   }

//   // Ajouter un commentaire
//   addCommentaire(commentaire: { contenu: string; document_id: number }): Observable<any> {
//     const token = localStorage.getItem('token'); // Récupère le token
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}` // Ajoute l'en-tête d'authentification
//     });

//     return this.http.post<any>(this.apiUrl, commentaire, { headers });
//   }
// }

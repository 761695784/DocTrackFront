import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  private apiUrlGet = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/declarations'; // URL pour récupérer les déclarations
  private apiUrlPost = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/declarations'; // URL pour ajouter des déclarations
  private apiUrlGetUserDeclarations = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/mydec';
  private apiUrlDelete = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/declarations';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les déclarations de l'utilisateur connecté
  getUserDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token); // Ajoute cette ligne pour vérifier le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(this.apiUrlGetUserDeclarations, { headers });
  }



  // Ajouter une déclaration
  addDeclaration(declaration: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // ajoute l'en-tête d'authentification
    });

    // Utilisation de FormData pour envoyer les données
    return this.http.post<any>(this.apiUrlPost, declaration, { headers }).pipe(
      tap(response => {
        console.log('Réponse du serveur:', response);
      })
    );
  }

  //afficher toutes les declaration pour l'admin uniquement
  getAllDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(this.apiUrlGet, { headers });
  }

    // Supprimer une déclaration
    deleteDeclaration(id: number): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.delete(`${this.apiUrlDelete}/${id}`, { headers });
    }
}

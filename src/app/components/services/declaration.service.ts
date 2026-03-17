import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les déclarations de l'utilisateur connecté
  getUserDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<any[]>(`${apiUrl}/my-declarations`, { headers });
  }

  // Ajouter une déclaration
  addDeclaration(declaration: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<any>(`${apiUrl}/declarations`, declaration, { headers }).pipe(
      tap(response => {
        // console.log('Réponse du serveur:', response);
      })
    );
  }

  // Afficher toutes les déclarations pour l'admin
  getAllDeclarations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<any[]>(`${apiUrl}/declarations`, { headers });
  }

  // Supprimer une déclaration
  deleteDeclaration(uuid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.delete(`${apiUrl}/declarations/${uuid}`, { headers });
  }

  // Récupérer les déclarations supprimées
  getTrashedDeclarations(): Observable<{ success: boolean; message: string; data: any[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<{ success: boolean; message: string; data: any[] }>(`${apiUrl}/trashed-declarations`, { headers });
  }

  // Restaurer une déclaration supprimée
  restoreDeclaration(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post(`${apiUrl}/declarations/restore/${id}`, {}, { headers });
  }

  // Afficher tous les certificats de pertes
  getCertificates(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<any[]>(`${apiUrl}/admin/certificats`, { headers });
  }

  // Telecharger les certificats de pertes
  downloadCertificate(uuid: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(
      `${apiUrl}/certificats/${uuid}/telecharger`,
      {
        headers,
        responseType: 'blob'
      }
    );
  }

  // Voir un certificat (ouvrir en PDF)
viewCertificate(uuid: string): Observable<Blob> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  return this.http.get(`${apiUrl}/certificats/${uuid}/voir`, {
    headers,
    responseType: 'blob'
  });
}

//   <a [href]="'https://ton-backend.com/api/certificats/' + certificat.id + '/telecharger'" target="_blank" download>
//     <i class="fa fa-download"></i>
// </a>

}

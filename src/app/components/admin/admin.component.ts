import { FormsModule } from '@angular/forms';
import { SideheadersComponent } from './../sideheaders/sideheaders.component';
import { AuthService } from './../services/auth.service';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,SideheadersComponent,FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  emailLogs: any[] = [];
  filteredDocuments: any[] = [];  // Documents filtrés par la recherche


  declarationsCount: number = 0;
  publicationsCount: number = 0;
  // restitutionsCount: number = 0;
  emailsSentCount: number = 0;
  restitutionCount: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadEmailLogs();
    this.loadAllData();
    this.loadRestitutionCount();
  }

  loadEmailLogs() {
    this.authService.getAllEmailLogs().subscribe(
      (response) => {
        this.emailLogs = response.data; // Assurez-vous que la structure de la réponse correspond
      },
      (error) => {
        console.error('Erreur lors du chargement des logs d\'emails:', error);
      }
    );
  }

  loadAllData(): void {
    this.authService.getAllData().subscribe(data => {
      this.declarationsCount = data.declarations.length;
      this.publicationsCount = data.publications.length;
      this.emailsSentCount = data.emailsSent.length;
      console.log('Emails envoyés:', this.emailsSentCount);  // Vérifiez si cette valeur est correcte
   });


  }

  loadRestitutionCount(): void {
    this.authService.getRestitutionRequestCount().subscribe({
      next: (data) => {
        this.restitutionCount = data.count;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du compte des restitutions', error);
      }
    });
  }

  viewDetails(documentId: number): void {
    // Implémentation pour voir les détails d'un document
    console.log('Voir détails pour', documentId);
  }

  deletePublication(documentId: number): void {
    // Implémentation pour supprimer une publication
    console.log('Suppression de la publication', documentId);
  }
}

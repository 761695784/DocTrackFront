import { FooterComponent } from './../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../services/publications.service';
import { CommonModule } from '@angular/common';


export interface Document {
  id: number;
  image: string;
  OwnerFirstName: string;
  OwnerLastName: string;
  Location: string;
  statut: string; // Peut être 'récupéré' ou 'non récupéré'
  document_type_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    FirstName: string;
    LastName: string;
    Phone: string;
    Adress?: string;  // Optionnel, selon si tu veux afficher l'adresse ou pas
    email: string;
    email_verified_at?: string;  // Optionnel, selon si c'est pertinent pour ton application
  };
}
@Component({
  selector: 'app-mypublish',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, FooterComponent, CommonModule],
  templateUrl: './mypublish.component.html',
  styleUrl: './mypublish.component.css'
})
export class MypublishComponent implements OnInit {
  publications: Document[] = [];


  constructor(private publicationService: PublicationsService) {}

  ngOnInit() {
    // Appel au service pour récupérer les publications de l'utilisateur connecté
    this.publicationService.getUserPublications().subscribe(
      (data: Document[]) => {
        this.publications = data;
      },
      error => {
        console.error('Erreur lors de la récupération des publications', error);
      }
    );
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  deletePublication(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      this.publicationService.deletePublication(id).subscribe({
        next: () => {
          this.publications = this.publications.filter(publication => publication.id !== id);
          alert('Publication supprimée avec succès.');
        },
        error: (err) => console.error('Erreur lors de la suppression de la publication', err)
      });
    }
  }
  toggleStatus(publication: Document): void {
    if (publication.user_id === this.getUserId()) {
        const newStatus = publication.statut === 'récupéré' ? 'non récupéré' : 'récupéré';
        console.log(`Changement du statut pour la publication ID ${publication.id}: ${newStatus}`);

        this.publicationService.updatePublicationStatus(publication.id, newStatus).subscribe({
            next: (response) => {
                console.log('Réponse de la mise à jour:', response);
                publication.statut = response.document.statut;  // Mettre à jour le statut affiché
                console.log('Statut après mise à jour:', publication.statut);
            },
            error: (err) => {
                console.error('Erreur lors de la mise à jour:', err);
                alert('Erreur lors de la mise à jour du statut. Détails: ' + (err.error?.message || err.message || 'Inconnu'));
            }
        });
    } else {
        alert("Vous n'êtes pas autorisé à modifier ce statut.");
    }
}
  // Méthode pour récupérer l'ID de l'utilisateur connecté (si stocké dans localStorage)
  private getUserId(): number | null {
    const userId = localStorage.getItem('userId'); // Assure-toi que tu as stocké cet ID lors de la connexion
    return userId ? Number(userId) : null;
  }
}

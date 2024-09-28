import { FooterComponent } from './../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../services/publications.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


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
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette publication ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicationService.deletePublication(id).subscribe({
          next: () => {
            this.publications = this.publications.filter(publication => publication.id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Publication supprimée avec succès.',
              icon: 'success',
              timer: 2000, // L'alerte disparaît après 2 secondes
              showConfirmButton: false // Ne pas afficher le bouton de confirmation
            });
          },
          error: (err) => console.error('Erreur lors de la suppression de la publication', err)
        });
      }
    });
  }

  toggleStatus(publication: Document): void {
    if (publication.user_id === this.getUserId()) {
      const newStatus = publication.statut === 'récupéré' ? 'non récupéré' : 'récupéré';
      const currentUserId = this.getUserId();
      console.log('publication.user_id:', publication.user_id);
      console.log('Current user ID:', this.getUserId());

      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: `Le statut va être changé en "${newStatus}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, changer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(`Changement du statut pour la publication ID ${publication.id}: ${newStatus}`);

          this.publicationService.updatePublicationStatus(publication.id, newStatus).subscribe({
            next: (response) => {
              console.log('Réponse de la mise à jour:', response);
              publication.statut = response.document.statut;  // Mettre à jour le statut affiché
              Swal.fire({
                title: 'Mise à jour!',
                text: `Le statut a été mis à jour à "${publication.statut}".`,
                icon: 'success',
                timer: 2000, // L'alerte disparaît après 2 secondes
                showConfirmButton: false // Ne pas afficher le bouton de confirmation
              });
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour:', err);
              Swal.fire('Erreur!', 'Erreur lors de la mise à jour du statut.', 'error');
            }
          });
        }
      });
    } else {
      Swal.fire('Non autorisé', "Vous n'êtes pas autorisé à modifier ce statut.", 'error');
    }
  }

  // Méthode pour récupérer l'ID de l'utilisateur connecté (si stocké dans localStorage)
  private getUserId(): number | null {
    const userId = localStorage.getItem('userId');  // Assurez-vous que cet ID est stocké lors de la connexion
    console.log('User ID:', userId);  // Ajoutez ce log pour le débogage
    return userId ? Number(userId) : null;
  }

}

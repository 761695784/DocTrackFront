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
    Adress?: string;  // Optionnel
    email: string;
    email_verified_at?: string;  // Optionnel
  };
  document_type :{
    id: number;
    TypeName: string;
  }
}

@Component({
  selector: 'app-mypublish',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, FooterComponent, CommonModule],
  templateUrl: './mypublish.component.html',
  styleUrls: ['./mypublish.component.css']  // Corrigé de styleUrl à styleUrls
})
export class MypublishComponent implements OnInit {
  publications: Document[] = [];
  trashedPublications: Document[] = []; // Pour stocker les documents supprimés
  showTrashed: boolean = false; // État pour afficher ou masquer les documents supprimés

  constructor(private publicationService: PublicationsService) {}

  ngOnInit() {
    this.loadUserPublications(); // Charge les publications de l'utilisateur
  }

  loadUserPublications() {
    this.publicationService.getUserPublications().subscribe(
      (data: Document[]) => {
        this.publications = data;
      },
      error => {
        // console.error('Erreur lors de la récupération des publications', error);
      }
    );
  }

  showTrashedDocuments() {
    this.showTrashed = true;
    this.loadTrashedDocuments();
  }

  loadTrashedDocuments() {
    this.publicationService.getTrashedDocuments().subscribe(
      (response: any) => {
        // console.log('Réponse de l\'API:', response);
        // Accéder aux données réelles
        this.trashedPublications = Array.isArray(response.data) ? response.data : [];
        // console.log('Documents supprimés après vérification:', this.trashedPublications);
      },
      error => {
        // console.error('Erreur lors du chargement des documents supprimés:', error);
      }
    );
  }

  restorePublication(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir restaurer cette publication ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, restaurer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicationService.restoreDocument(id).subscribe({
          next: (response) => {
            Swal.fire('Restauré!', response.message, 'success');
            this.loadTrashedDocuments(); // Recharger les documents supprimés
            this.loadUserPublications(); // Recharger les publications de l'utilisateur
          },
          error: (err) => {
            Swal.fire('Erreur!', 'Erreur lors de la restauration.', 'error');
          }
        });
      }
    });
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
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            // console.error('Erreur lors de la suppression de la publication', err);
          }
        });
      }
    });
  }

  toggleStatus(publication: Document): void {
    if (publication.user_id === this.getUserId()) {
      const newStatus = publication.statut === 'récupéré' ? 'non récupéré' : 'récupéré';

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
          this.publicationService.updatePublicationStatus(publication.id, newStatus).subscribe({
            next: (response) => {
              publication.statut = response.document.statut;  // Mettre à jour le statut affiché
              Swal.fire({
                title: 'Mise à jour!',
                text: `Le statut a été mis à jour à "${publication.statut}".`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err) => {
              // console.error('Erreur lors de la mise à jour:', err);
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
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }
}

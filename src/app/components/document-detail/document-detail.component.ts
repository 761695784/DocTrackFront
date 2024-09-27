import { AuthService } from './../services/auth.service';
import { FooterComponent } from './../footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from '../services/details.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { CommentairesService } from '../services/commentaire.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Assurez-vous d'utiliser une interface pour décrire les données du document
export interface DocumentDetails {
  id: number;
  image: string | null; // Peut être null si aucune image n'est fournie
  OwnerFirstName: string;
  OwnerLastName: string;
  Location: string;
  statut: string; // Peut être 'récupéré' ou 'non récupéré'
  document_type_id: number;
  identification: string;
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
export interface Commentaire {
  id: number;
  contenu: string;
  document_id: number;
  user: {
    FirstName: string;
    LastName: string;
  };
  created_at: string;
}



@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  documentDetails: DocumentDetails | null = null; // Utiliser le type DocumentDetails
  commentaires: Commentaire[] = []; // Ajout pour stocker les commentaires
  newComment: string = ''; // Pour stocker le contenu du nouveau commentaire

  constructor(
    private route: ActivatedRoute,
    private detailsService: DetailsService,
    private commentairesService: CommentairesService, // Ajout du service Commentaires
    private authService: AuthService // Ajout du service AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const documentIdString = paramMap.get('id');
      if (documentIdString) {
        const documentId = +documentIdString; // Convertir en nombre
        this.getDocumentDetails(documentId);
        this.getCommentaires(documentId); // Charger les commentaires dès que le document est chargé
      } else {
        console.error('Document ID is null or undefined');
      }
    });
  }

  getDocumentDetails(id: number): void {
    this.detailsService.getDocumentDetails(id).subscribe({
      next: (details) => {
        // Vérifie si l'image existe et ajoute le préfixe pour l'URL complète
        details.image = details.image ? `http://localhost:8000${details.image}` : '';
        this.documentDetails = details; // Assurez-vous de bien utiliser les données comme vous en avez besoin
      },
      error: (err) => console.error('Erreur lors de la récupération des détails du document', err)
    });
  }

  getCommentaires(documentId: number): void {
    this.commentairesService.getCommentairesByDocument(documentId).subscribe({
      next: (comments) => {
        this.commentaires = comments;
      },
      error: (err) => console.error('Erreur lors de la récupération des commentaires', err)
    });
  }

  // Méthode pour ajouter un commentaire
  addCommentaire(): void {
    if (this.authService.isAuthenticated() && this.newComment.trim() !== '' && this.documentDetails?.id !== undefined) {
      const commentaireData = {
        contenu: this.newComment,
        document_id: this.documentDetails!.id // Utilisation de l'opérateur non-null assertion '!'
      };

      this.commentairesService.addCommentaire(commentaireData).subscribe({
        next: () => {
          this.newComment = '';
          this.getCommentaires(this.documentDetails?.id!); // Utilisation de l'opérateur non-null assertion '!'
          Swal.fire({
            icon: 'success',
            title: 'Commentaire ajouté',
            text: 'Votre commentaire a été ajouté avec succès.',
          });
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du commentaire', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de votre commentaire.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Non authentifié',
        text: 'Vous devez être authentifié pour ajouter un commentaire.',
      });
    }
  }

  // Méthode pour demander la restitution d'un document
  requestRestitution(): void {
    if (this.documentDetails) {
      this.detailsService.requestRestitution(this.documentDetails.id).subscribe({
        next: (response) => {
          console.log('Notification envoyée avec succès');
          Swal.fire({
            icon: 'success',
            title: 'Demande envoyée',
            text: 'Votre demande de restitution a été envoyée avec succès.',
          });
        },
        error: (err) => {
          console.error('Erreur lors de la demande de restitution', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la demande de restitution.',
          });
        }
      });
    }
  }

}

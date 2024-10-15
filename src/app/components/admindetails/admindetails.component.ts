import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { FooterComponent } from '../footer/footer.component';
import { Commentaire, DocumentDetails } from '../document-detail/document-detail.component';
import { PublicationsService } from '../services/publications.service';
import { DetailsService } from '../services/details.service';
import { CommentairesService } from '../services/commentaire.service';
import Swal from'sweetalert2';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-admindetails',
  standalone: true,
  imports: [FooterComponent, SideheadersComponent,CommonModule,FormsModule],
  templateUrl: './admindetails.component.html',
  styleUrl: './admindetails.component.css'
})
export class AdmindetailsComponent {
  // Déclaration des variables pour les données du document et des commentaires
  selectedDocumentId: number | null = null; // Utiliser le type number pour stocker l'ID du document sélectionné
  selectedCommentId: number | null = null; // Utiliser le type number pour stocker l'ID du commentaire sélectionné
  document: any; // Utiliser le type any pour stocker les données du document
  documentDetails: DocumentDetails | null = null; // Utiliser le type DocumentDetails
  selectedDocumentDetails: DocumentDetails | null = null;
  commentaires: Commentaire[] = []; // Ajout pour stocker les commentaires
  newComment: string = ''; // Pour stocker le contenu du nouveau commentaire
  publications: Document[] = [];


  constructor(
    private publicationsService: PublicationsService,
    private detailsService: DetailsService,
    private commentairesService: CommentairesService,
    private route: ActivatedRoute,  // Ajout du service ActivatedRoute
    private authService: AuthService // Ajout du service AuthService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const documentIdString = paramMap.get('id');
      if (documentIdString) {
        const documentId = +documentIdString; // Convertir en nombre
        this.getDocumentDetails(documentId);
        this.getCommentaires(documentId); // Charger les commentaires dès que le document est chargé
      } else {
        // console.error('Document ID is null or undefined');
      }
    });
  }


  getDocumentDetails(id: number): void {
    this.detailsService.getDocumentDetails(id).subscribe({
      next: (details) => {
          details.image = details.image ? `https://doctrackapi.malang2019marna.simplonfabriques.com${details.image}` : '';
        //  details.image = details.image ? `http://localhost:8000${details.image}` : '';
        this.documentDetails = details;
      },
      error: (err) => {
        if (err.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Ce document a été supprimé par l\'utilisateur et n\'est plus accessible.',
          });
        } else {
          // console.error('Erreur lors de la récupération des détails du document', err);
        }
      }
    });
  }

  getCommentaires(documentId: number): void {
    this.commentairesService.getCommentairesByDocument(documentId).subscribe({
      next: (comments) => {
        this.commentaires = comments;
      },
      // error: (err) => console.error('Erreur lors de la récupération des commentaires', err)
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
            timer: 2000, // Durée de l'alerte en millisecondes
            showConfirmButton: false // Ne pas afficher le bouton de confirmation
          });
        },
        error: (err) => {
          // console.error('Erreur lors de l\'ajout du commentaire', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de votre commentaire.',
            timer: 2000, // Durée de l'alerte en millisecondes
            showConfirmButton: false // Ne pas afficher le bouton de confirmation
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Non authentifié',
        text: 'Vous devez être authentifié pour ajouter un commentaire.',
        timer: 2000, // Durée de l'alerte en millisecondes
        showConfirmButton: false // Ne pas afficher le bouton de confirmation
      });
    }
  }




}

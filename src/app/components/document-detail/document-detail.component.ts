import { FooterComponent } from './../footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from '../services/details.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

// Assurez-vous d'utiliser une interface pour décrire les données du document
export interface DocumentDetails {
  id: number;
  image: string | null; // Peut être null si aucune image n'est fournie
  OwnerFirstName: string;
  OwnerLastName: string;
  Location: string;
  statut: string; // Peut être 'récupéré' ou 'non récupéré'
  document_type_id: number;
  identification:string;
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
  selector: 'app-document-detail',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  documentDetails: DocumentDetails | null = null; // Utiliser le type DocumentDetails

  constructor(private route: ActivatedRoute, private detailsService: DetailsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const documentIdString = paramMap.get('id');
      if (documentIdString) {
        const documentId = +documentIdString; // Convertir en nombre
        this.getDocumentDetails(documentId);
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
}

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicationsService } from './../services/publications.service';
import { FooterComponent } from './../footer/footer.component';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-document-list',
  standalone: true,
  imports: [NavbarComponent, FooterComponent,CommonModule,FormsModule ],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private publicationsService: PublicationsService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.publicationsService.getAllPublications().subscribe({
      next: (data) => {
        console.log(data); // Ajoutez ceci pour vérifier la réponse
        this.documents = data;

      },
      error: (err) => console.error('Failed to fetch documents', err)
    });
  }
  // Ajouter d'autres méthodes pour manipuler les publications si nécessaire


  viewDetails(id: number): void {
    this.router.navigate(['/document', id]); // Remplacez '/document' par votre route de détails
  }
}

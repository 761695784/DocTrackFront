import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  document_type :{
    id: number;
    TypeName: string;
  }
}

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;


  constructor(private publicationsService: PublicationsService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.publicationsService.getAllPublications().subscribe({
      next: (data) => {
        // console.log('Documents fetched:', data); // Vérifiez la réponse de l'API
        // Trier les documents du plus récent au plus ancien
        this.documents = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.filteredDocuments = this.documents; // Initialisez filteredDocuments avec tous les documents
      },
      // error: (err) => console.error('Failed to fetch documents', err)
    });
  }

  filterDocuments(): void {
    // console.log('Search Term:', this.searchTerm); // Affiche le terme de recherche
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredDocuments = this.documents.filter(document =>
        document.OwnerFirstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        document.OwnerLastName.toLowerCase().includes(lowerCaseSearchTerm)
      );
      // console.log('Filtered Documents:', this.filteredDocuments); // Vérifiez les documents filtrés
    } else {
      this.filteredDocuments = this.documents; // Si le champ de recherche est vide, affiche tous les documents
      // console.log('No search term, showing all documents.');
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/document', id]); // Remplacez '/document' par votre route de détails
  }

  goToMyPublications(): void {
    this.router.navigate(['/mypub']); // Redirection vers la route /mypub
  }


  pageChanged(page: number): void {
    this.currentPage = page;
  }


  get paginatedFilteredDocuments(): Document[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDocuments.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get paginatedDocuments(): Document[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.documents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.documents.length / this.itemsPerPage);
  }

}

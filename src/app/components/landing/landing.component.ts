import { Component, OnInit } from '@angular/core';
import { PublicationsService } from './../services/publications.service';
import { Document } from '../document-list/document-list.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importez Router ici

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  searchTerm: string = '';
  documents: Document[] = [];
  filteredDocuments: Document[] = [];

  // Injectez Router dans le constructeur
  constructor(private publicationsService: PublicationsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.publicationsService.getAllPublications().subscribe({
      next: (data) => {
        console.log('Documents fetched:', data);
        this.documents = data;
        this.filteredDocuments = data;
      },
      error: (err) => console.error('Failed to fetch documents', err)
    });
  }

  filterDocuments(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredDocuments = this.documents.filter(document =>
      document.OwnerFirstName.toLowerCase().includes(lowerCaseSearchTerm) ||
      document.OwnerLastName.toLowerCase().includes(lowerCaseSearchTerm)
    );
    console.log('Filtered Documents:', this.filteredDocuments);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/document', id]); // Assurez-vous que votre route est correcte
  }
}

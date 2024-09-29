import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommentairesService } from './../services/commentaire.service';
import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../services/publications.service';
import { Document } from '../document-list/document-list.component';
import { Commentaire, DocumentDetails } from '../document-detail/document-detail.component';
import { FooterComponent } from '../footer/footer.component';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { DetailsService } from '../services/details.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-adminpub',
  standalone: true,
  imports: [FooterComponent, SideheadersComponent,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './adminpub.component.html',
  styleUrls: ['./adminpub.component.css']
})
export class AdminpubComponent implements OnInit {
  documents: Document[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;

  constructor(
    private publicationsService: PublicationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllPublications();
  }

  loadAllPublications(): void {
    this.publicationsService.getAllPublications().subscribe({
      next: (docs) => this.documents = docs,
      error: (err) => console.error('Erreur lors de la récupération des publications', err)
    });
  }
  viewDetails(id: number): void {
    this.router.navigate(['/admindetails', id]); // Remplacez '/document' par votre route de détails
  }


    // Méthode pour changer de page
    pageChanged(event: number): void {
      this.currentPage = event;
    }

      // Méthode pour afficher les documents de la page actuelle
  get paginatedDocuments(): Document[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.documents.slice(startIndex, startIndex + this.itemsPerPage);
  }

}

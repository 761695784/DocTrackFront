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
import Swal from 'sweetalert2';




@Component({
  selector: 'app-adminpub',
  standalone: true,
  imports: [FooterComponent, SideheadersComponent,CommonModule,FormsModule],
  templateUrl: './adminpub.component.html',
  styleUrls: ['./adminpub.component.css']
})
export class AdminpubComponent implements OnInit {
  documents: Document[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  filteredDocuments: Document[] = [];

  constructor(
    private publicationsService: PublicationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllPublications();
  }

  loadAllPublications(): void {
    this.publicationsService.getAllPublications().subscribe({
      next: (docs) => {
        this.documents = docs.sort((a: Document, b: Document) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.filteredDocuments = this.documents; // Initialise filteredDocuments avec tous les documents
      },
      // error: (err) => console.error('Erreur lors de la récupération des publications', err)
    });
  }


  filterDocuments(): void {
    this.currentPage = 1;  // Réinitialiser à la première page
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredDocuments = this.documents.filter(document =>
        document.OwnerFirstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        document.OwnerLastName.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else {
      this.filteredDocuments = this.documents;
    }
  }


  viewDetails(id: number): void {
    this.router.navigate(['/admindetails', id]); // Remplacez '/document' par votre route de détails
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }

  get paginatedDocuments(): Document[] {
    const docsToPaginate = this.filteredDocuments.length > 0 ? this.filteredDocuments : this.documents;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return docsToPaginate.slice(startIndex, startIndex + this.itemsPerPage);
  }


  get totalPages(): number {
    return Math.ceil(this.documents.length / this.itemsPerPage);
  }


  deletePublication(id: number): void {
    if (id) {
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
          this.publicationsService.deletePublication(id).subscribe({
            next: () => {
              Swal.fire({
                title: 'Supprimé!',
                text: 'Publication supprimée avec succès.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadAllPublications(); // Recharge la liste des publications après suppression
            },
            error: (err) => {
              // console.error('Erreur lors de la suppression de la publication', err);
              Swal.fire({
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la suppression.',
                icon: 'error'
              });
            }
          });
        }
      });
    } else {
      // console.error('L\'ID de la publication est invalide.');
    }
  }



}

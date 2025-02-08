import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from'sweetalert2';
import { DeclarationService } from '../services/declaration.service';
import { NgxPaginationModule } from 'ngx-pagination';


export interface Declaration {
  id: number;
  Title:string;
  user_id: number;
  document_id: number;
  FirstNameInDoc: string;
	LastNameInDoc: string;
  created_at: string;
  user: {
    id: number;
    FirstName: string;
    LastName: string;
    Phone: string;
    Adress?: string;  // Optionnel, selon si tu veux afficher l'adresse ou pas
    email: string;
    email_verified_at?: string;  // Optionnel, selon si c'est pertinent pour ton application
  };
  document_type:{
    id: number;
    TypeName: string;
  }

}

@Component({
  selector: 'app-admindeclaration',
  standalone: true,
  imports: [SideheadersComponent,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './admindeclaration.component.html',
  styleUrl: './admindeclaration.component.css'
})
export class AdmindeclarationComponent {
  declarations: Declaration[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;  // Nombre total de pages


  constructor(
      private declarationService: DeclarationService,
      private route: ActivatedRoute,  // Ajout du service ActivatedRoute
      private authService: AuthService// Ajout du service AuthService
      ) {}


      ngOnInit() {
        this.loadAllDeclarations();
      }

      loadAllDeclarations() {
        this.declarationService.getAllDeclarations().subscribe(
          (response: any) => {
            // Tri des déclarations par date de création (du plus récent au plus ancien)
            this.declarations = response.data.sort((a: Declaration, b: Declaration) => {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            // Calcul du nombre total de pages
            this.totalPages = Math.ceil(this.declarations.length / this.itemsPerPage);
          },
          (error) => {
            console.error('Erreur lors du chargement des déclarations', error);
          }
        );
      }

      pageChanged(newPage: number): void {
        if (newPage >= 1 && newPage <= this.totalPages) {
          this.currentPage = newPage;
        }
      }

      get paginatedDeclarations(): Declaration[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.declarations.slice(startIndex, startIndex + this.itemsPerPage);
      }








 // Nouvelle méthode de suppression avec confirmation
 deleteDeclaration(id: number) {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.declarationService.deleteDeclaration(id).subscribe(
        () => {
          this.declarations = this.declarations.filter(d => d.id !== id);
          Swal.fire(
            'Supprimé!',
            'La déclaration a été supprimée avec succès.',
            'success'
          );
        },
        (error) => {
          // console.error('Erreur lors de la suppression de la déclaration', error);
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la suppression.',
            'error'
          );
        }
      );
    }
  });
}


}

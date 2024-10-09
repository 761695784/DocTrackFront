import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from'sweetalert2';
import { DeclarationService } from '../services/declaration.service';
import { NgxPaginationModule } from 'ngx-pagination';


export interface Declaration {
  id: number;
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

}



@Component({
  selector: 'app-admindeclaration',
  standalone: true,
  imports: [FooterComponent, SideheadersComponent,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './admindeclaration.component.html',
  styleUrl: './admindeclaration.component.css'
})
export class AdmindeclarationComponent {
  declarations: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;


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
            // console.log('Réponse complète:', response);
            this.declarations = response.data;  // Assigner toutes les déclarations
          },
          (error) => {
            // console.error('Erreur lors du chargement des déclarations', error);
          }
        );
      }

      pageChanged(event: number): void {
        this.currentPage = event;
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

import { FormsModule } from '@angular/forms';
import { FooterComponent } from './../footer/footer.component';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclarationService } from '../services/declaration.service';
import Swal from 'sweetalert2';






@Component({
  selector: 'app-lostdeclaration',
  standalone: true,
  imports: [NavbarComponent,FooterComponent, FormsModule, CommonModule],
  templateUrl: './lostdeclaration.component.html',
  styleUrl: './lostdeclaration.component.css'
})
export class LostdeclarationComponent {
  declarations: any[] = [];

  constructor(private declarationService: DeclarationService) {}

  ngOnInit() {
    this.loadUserDeclarations();
  }

  loadUserDeclarations() {
    this.declarationService.getUserDeclarations().subscribe(
      (response: any) => {
        console.log('Réponse complète:', response);  // Vérifier le nombre d'éléments dans response.data
        this.declarations = response.data;  // Assigner correctement les déclarations
      },
      (error) => {
        console.error('Erreur lors du chargement des déclarations', error);
      }
    );
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
      // Si l'utilisateur confirme, effectuer la suppression
      this.declarationService.deleteDeclaration(id).subscribe(
        () => {
          // Supprimer la déclaration localement après confirmation
          this.declarations = this.declarations.filter(d => d.id !== id);
          // Afficher une alerte de succès
          Swal.fire(
            'Supprimé!',
            'La déclaration a été supprimée avec succès.',
            'success'
          );
        },
        (error) => {
          console.error('Erreur lors de la suppression de la déclaration', error);
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

import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideheadersComponent } from "../sideheaders/sideheaders.component";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';  // Importation de SweetAlert2

@Component({
  selector: 'app-userget',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, NgbModule, SideheadersComponent],
  templateUrl: './userget.component.html',
  styleUrl: './userget.component.css'
})
export class UsergetComponent implements OnInit {

  users: any[] = []; // Pour stocker les utilisateurs récupérés

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Méthode pour charger tous les utilisateurs
  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
        }
      },
      error: (err) => console.error('Erreur lors de la récupération des utilisateurs', err)
    });
  }

  // Méthode pour supprimer un utilisateur (à implémenter plus tard)
// Méthode pour confirmer la suppression d'un utilisateur avec SweetAlert
  deleteUser(userId: number): void {
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
        // Si l'utilisateur confirme la suppression
        this.authService.deleteUser(userId).subscribe({
          next: () => {
            // Afficher SweetAlert après une suppression réussie
            Swal.fire(
              'Supprimé !',
              'L\'utilisateur a été supprimé.',
              'success'
            );
            // Recharger la liste des utilisateurs
            this.loadUsers();
          },
          error: (err) => {
            // Afficher SweetAlert en cas d'erreur
            Swal.fire(
              'Erreur !',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
            console.error('Erreur lors de la suppression de l\'utilisateur', err);
          }
        });
      }
    });
  }

  // Methode pour etre redirigé vers la page d'ajout
  addUser(): void {
    this.router.navigate(['/adminadd']); // Redirection vers la route adminadd
  }

}

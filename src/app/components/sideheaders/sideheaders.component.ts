import { FormsModule } from '@angular/forms';
import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PublicationsService } from '../services/publications.service';


@Component({
  selector: 'app-sideheaders',
  standalone: true,
  imports: [SidebarComponent,CommonModule,FormsModule,NgbModule],
  templateUrl: './sideheaders.component.html',
  styleUrl: './sideheaders.component.css'
})
export class SideheadersComponent implements OnInit{

  FirstName: string = '';
  documents: any[] = []; // Pour stocker les documents récupérés
  filteredDocuments: any[] = [];  // Documents filtrés par la recherche
  searchQuery: string = '';  // Texte entré dans la barre de recherche
  newNotifications: any[] = [];
  searchTerm: string = '';
  @Output() searchEvent = new EventEmitter<string>();



  onSearch() {
    this.searchEvent.emit(this.searchTerm); // Emettre une chaîne de caractères
  }


  constructor(public authService: AuthService , private router: Router,  publicationsService: PublicationsService) {}

  ngOnInit() {
    this.FirstName = this.authService.getUserName(); // Récupérer le nom de l'utilisateur

  }

    // Méthode pour filtrer les documents selon la recherche
    searchDocuments(): void {
      const query = this.searchQuery.toLowerCase();
      this.filteredDocuments = this.documents.filter(document =>
        document.Title.toLowerCase().includes(query) ||  // Cherche dans le titre
        document.OwnerFirstName.toLowerCase().includes(query) ||  // Cherche dans le prénom
        document.OwnerLastName.toLowerCase().includes(query)  // Cherche dans le nom
      );
    }




  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  // Méthode pour se déconnecter
  logout() {
    this.authService.logout();
    }

}

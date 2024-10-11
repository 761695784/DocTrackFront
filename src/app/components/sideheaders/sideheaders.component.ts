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
export class SideheadersComponent implements OnInit {
  FirstName: string = '';
  documents: any[] = []; // Pour stocker les documents récupérés
  filteredDocuments: any[] = []; // Documents filtrés par la recherche
  searchQuery: string = ''; // Texte entré dans la barre de recherche
  newNotifications: any[] = [];
  searchTerm: string = '';
  @Output() searchEvent = new EventEmitter<string>();
  isDropdownOpen = false; // Contrôler l'ouverture du dropdown
  hasSeenNotifications = false; // Contrôle si l'utilisateur a vu les notifications

  onSearch() {
    this.searchEvent.emit(this.searchTerm); // Émettre une chaîne de caractères
    // Ferme le dropdown si l'utilisateur clique en dehors de celui-ci
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    // Retire l'écouteur d'événement lorsque le composant est détruit
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }


  constructor(public authService: AuthService, private router: Router, publicationsService: PublicationsService) {}

  ngOnInit() {
    this.FirstName = this.authService.getUserName(); // Récupérer le nom de l'utilisateur
    this.startPolling();


  }

  // Démarrer le polling pour les nouvelles notifications
  startPolling() {
    setInterval(() => {
      this.authService.checkForNewNotifications().subscribe(response => {
        const { newDocuments, newDeclarations } = response;
        console.log('New Documents:', newDocuments);
        console.log('New Declarations:', newDeclarations);

        // Fusionner les nouveaux documents et déclarations
        this.newNotifications = [...newDocuments, ...newDeclarations];

        // Si l'utilisateur n'a pas vu les notifications, on garde la notification visible
        if (this.newNotifications.length > 0) {
          this.hasSeenNotifications = false; // Rappeler que les notifications ne sont pas vues
        }

        this.authService.updateLastChecked();
      });
    }, 5000); // Vérifier toutes les 5 secondes
  }

  // Méthode pour ouvrir/fermer le dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;

    // Lorsque l'utilisateur ouvre le dropdown, marquer les notifications comme vues
    if (this.isDropdownOpen) {
      this.hasSeenNotifications = true; // Marquer comme vu
    }
  }

 // Méthode pour fermer le dropdown si on clique en dehors
 onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // Si le clic n'est pas à l'intérieur du bouton ou du dropdown, on ferme le dropdown
  if (!target.closest('.notification-icon')) {
    this.isDropdownOpen = false;
  }
}

  // Méthode pour filtrer les documents selon la recherche
  searchDocuments(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredDocuments = this.documents.filter(document =>
      document.Title.toLowerCase().includes(query) || // Cherche dans le titre
      document.OwnerFirstName.toLowerCase().includes(query) || // Cherche dans le prénom
      document.OwnerLastName.toLowerCase().includes(query) // Cherche dans le nom
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

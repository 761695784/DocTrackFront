import { FooterComponent } from './../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../services/publications.service';
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
}
@Component({
  selector: 'app-mypublish',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, FooterComponent, CommonModule],
  templateUrl: './mypublish.component.html',
  styleUrl: './mypublish.component.css'
})
export class MypublishComponent implements OnInit {
  publications: Document[] = [];

  constructor(private publicationService: PublicationsService) {}

  ngOnInit() {
    // Appel au service pour récupérer les publications de l'utilisateur connecté
    this.publicationService.getUserPublications().subscribe(
      (data: Document[]) => {
        this.publications = data;
      },
      error => {
        console.error('Erreur lors de la récupération des publications', error);
      }
    );
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

}

import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PublicationsService } from '../services/publications.service';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publishform',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './publishform.component.html',
  styleUrls: ['./publishform.component.css']
})
export class PublishformComponent {
  publishForm: FormGroup;

  documentTypes = [
    { id: 1, name: "Carte nationale d'identité" },
    { id: 2, name: "Passeport" },
    { id: 3, name: "Permis de conduire" },
    { id: 4, name: "Carte grise" },
    { id: 5, name: "Certificat de naissance" },
    { id: 6, name: "Diplômes Baccalauréat" },
    { id: 7, name: "Carte professionnelle" },
    { id: 8, name: "Carte bancaire" },
    { id: 9, name: "Attestation d'assurance" },
    { id: 10, name: "Carnet de santé" },
    { id: 11, name: "Carte d'étudiant" }
  ];

  constructor(
    private publicationsService: PublicationsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.publishForm = this.fb.group({
      image: ['', Validators.required], // Image ou document
      OwnerLastName: ['', Validators.required], // Nom propriétaire
      OwnerFirstName: ['', Validators.required], // Prénom propriétaire
      DocIdentification: [''], // Champ optionnel
      Location: ['', Validators.required], // Lieu de Trouvaille
      documentType: ['', Validators.required], // Type de Document
      statut: ['non récupéré', Validators.required] // Statut par défaut
    });
  }

  onSubmit() {
    // Validation conditionnelle pour DocIdentification
    if (this.publishForm.get('DocIdentification')?.value) {
      this.publishForm.get('DocIdentification')?.setValidators([Validators.required]);
    } else {
      this.publishForm.get('DocIdentification')?.clearValidators();
    }

    // Mettre à jour la validité du champ
    this.publishForm.get('DocIdentification')?.updateValueAndValidity();

    // Vérifier la validité du formulaire
    if (this.publishForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide !',
        text: 'Veuillez remplir tous les champs requis.',
        timer: 2000, // Masquer après 2 secondes
        timerProgressBar: true // Barre de progression
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', this.publishForm.get('image')?.value);
    formData.append('OwnerLastName', this.publishForm.get('OwnerLastName')?.value);
    formData.append('OwnerFirstName', this.publishForm.get('OwnerFirstName')?.value);
    formData.append('DocIdentification', this.publishForm.get('DocIdentification')?.value);
    formData.append('Location', this.publishForm.get('Location')?.value);
    formData.append('document_type_id', this.publishForm.get('documentType')?.value);
    formData.append('statut', this.publishForm.get('statut')?.value);

    console.log('Données à envoyer :', formData);

    // Vérification de l'authentification pour pouvoir publier un document
    if (this.authService.isAuthenticated()) {
      this.publicationsService.addPublication(formData).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Publication ajoutée !',
          text: 'Votre document a été publié avec succès.',
          timer: 2000, // Masquer après 2 secondes
          timerProgressBar: true // Barre de progression
        });
        this.publishForm.reset(); // Réinitialisation du formulaire
      }, error => {
        console.error('Erreur lors de l\'ajout de la publication:', error.error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: error.error.message || 'Une erreur est survenue lors de l\'ajout de votre document.',
          timer: 2000, // Masquer après 2 secondes
          timerProgressBar: true // Barre de progression
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Non authentifié !',
        text: 'Vous devez vous connecter pour publier un document.',
        timer: 2000, // Masquer après 2 secondes
        timerProgressBar: true // Barre de progression
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.publishForm.patchValue({
        image: file // Assurez-vous que cela correspond au nom du contrôle
      });
    }
  }
}

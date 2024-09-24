import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DeclarationService } from '../services/declaration.service';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-declarationform',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './declarationform.component.html',
  styleUrls: ['./declarationform.component.css']
})
export class DeclarationformComponent {
  declarationForm: FormGroup;

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
    private fb: FormBuilder,
    private declarationService: DeclarationService,
    private authService: AuthService
  ) {
    this.declarationForm = this.fb.group({
      Title: ['', Validators.required], // Titre de la déclaration
      FirstNameInDoc: ['', Validators.required], // Prénom exact
      LastNameInDoc: ['', Validators.required], // Nom exact
      documentType: ['', Validators.required], // Type de document
      DocIdentification: [''] // Numéro d'identification
    });
  }

  onSubmit() {
    // Validation conditionnelle pour DocIdentification
    if (this.declarationForm.get('DocIdentification')?.value) {
      this.declarationForm.get('DocIdentification')?.setValidators([Validators.required]);
    } else {
      this.declarationForm.get('DocIdentification')?.clearValidators();
    }

    // Mettre à jour la validité du champ
    this.declarationForm.get('DocIdentification')?.updateValueAndValidity();

    // Vérifier la validité du formulaire
    if (this.declarationForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide !',
        text: 'Veuillez remplir tous les champs requis.',
      });
      return;
    }

    // Préparation des données à envoyer
    const formData = new FormData();
    formData.append('Title', this.declarationForm.get('Title')?.value);
    formData.append('FirstNameInDoc', this.declarationForm.get('FirstNameInDoc')?.value);
    formData.append('LastNameInDoc', this.declarationForm.get('LastNameInDoc')?.value);
    formData.append('document_type_id', this.declarationForm.get('documentType')?.value); // Vérifier cet ID
    formData.append('DocIdentification', this.declarationForm.get('DocIdentification')?.value);

    console.log('Données à envoyer :', formData);
    console.log('Selected Document Type ID:', this.declarationForm.get('documentType')?.value);
    // Vérifier l'authentification avant de soumettre la déclaration
    if (this.authService.isAuthenticated()) {
      this.declarationService.addDeclaration(formData).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Déclaration ajoutée !',
          text: "Votre déclaration de perte a été soumise avec succès.Nous vous notifierons une fois qu'une publication correspondant à votre Déclaration. Sur ce nous vous conseillons de temps en temps verifer votre Boite Mail !! "
        });
        this.declarationForm.reset(); // Réinitialisation du formulaire
      }, error => {
        console.error('Erreur lors de l\'ajout de la déclaration:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: error.error.message || 'Une erreur est survenue lors de la soumission de votre déclaration.',
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Non authentifié !',
        text: 'Vous devez vous connecter pour soumettre une déclaration.',
      });
    }
  }
}

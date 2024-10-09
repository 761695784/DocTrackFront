import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DeclarationService } from '../services/declaration.service';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-declaration',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  standalone: true,
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
      Title: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      FirstNameInDoc: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      LastNameInDoc: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],
      documentType: ['', Validators.required],
      DocIdentification: [''] // Numéro d'identification optionnel
    });
  }

  getErrorMessage(field: string): string {
    const control = this.declarationForm.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire.';
    } else if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Ce champ doit contenir au moins ${minLength} caractères.`;
    } else if (control?.hasError('pattern')) {
      return 'Ce champ ne doit contenir que des lettres.';
    }
    return '';
  }

  onSubmit() {
    // Vérifie si le formulaire est valide
    if (this.declarationForm.invalid) {
      this.declarationForm.markAllAsTouched(); // Marque tous les champs comme touchés pour afficher les erreurs
      return;
    }

    // Préparation des données pour l'envoi
    const formData = new FormData();
    formData.append('Title', this.declarationForm.get('Title')?.value);
    formData.append('FirstNameInDoc', this.declarationForm.get('FirstNameInDoc')?.value);
    formData.append('LastNameInDoc', this.declarationForm.get('LastNameInDoc')?.value);
    formData.append('document_type_id', this.declarationForm.get('documentType')?.value);
    formData.append('DocIdentification', this.declarationForm.get('DocIdentification')?.value);

    // Vérification de l'authentification avant de soumettre
    if (this.authService.isAuthenticated()) {
      this.declarationService.addDeclaration(formData).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Déclaration ajoutée !',
          text: 'Votre déclaration de perte a été soumise avec succès.Nous vous notifierons une fois qu"une publication correspondant à votre Déclaration. Sur ce nous vous conseillons de temps en temps verifer votre Boite Mail !!',
          timer: 8000,
          timerProgressBar: true
        });
        this.declarationForm.reset(); // Réinitialisation du formulaire
      }, error => {
        // console.error('Erreur lors de l\'ajout de la déclaration:', error.error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: error.error.message || 'Une erreur est survenue lors de l\'ajout de votre déclaration.',
          timer: 2000,
          timerProgressBar: true
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Non authentifié !',
        text: 'Vous devez vous connecter pour soumettre une déclaration.',
        timer: 2000,
        timerProgressBar: true
      });
    }
  }
}

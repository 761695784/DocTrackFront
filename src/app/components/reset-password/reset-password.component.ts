import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup; // FormGroup pour le formulaire
  isSubmitting: boolean = false; // Indicateur pour éviter des soumissions multiples
  successMessage: string = ''; // Message de succès
  errorMessage: string = ''; // Message d'erreur

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Initialisation du formulaire
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    // Si le formulaire n'est pas valide, ne pas soumettre
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // Récupérer l'email depuis le formulaire
    const email = this.resetPasswordForm.value.email;
    this.isSubmitting = true; // Début du chargement
    this.successMessage = ''; // Réinitialiser les messages
    this.errorMessage = '';

    // Appel au service pour envoyer l'email
    this.authService.sendResetPasswordEmail(email).subscribe({
      next: (response) => {
        this.successMessage = 'Un email de réinitialisation a été envoyé à votre adresse.';
        this.isSubmitting = false; // Fin du chargement
        this.resetPasswordForm.reset(); // Réinitialiser le formulaire
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.isSubmitting = false; // Fin du chargement
      }
    });
  }

}

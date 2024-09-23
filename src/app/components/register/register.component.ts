import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export interface User {
  LastName: string;
  FirstName: string;
  Adress: string;
  Phone: string;
  email: string;
  password: string;
  password_confirmation: string;  // Ajouter cette ligne
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      LastName: ['', Validators.required],
      FirstName: ['', Validators.required],
      Adress: ['', Validators.required],
      Phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required], // Change in TypeScript code
    });
  }

  ngOnInit(): void {
    console.log('Register component initialized.');
  }

  onSubmit(): void {
    console.log('Form submitted:', this.registerForm.value);

    if (this.registerForm.valid) {
      const userData: User = {
        ...this.registerForm.value,
        confirmation_password: this.registerForm.value.password  // Assignez ici la valeur
      };

      console.log('User data to send:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          Swal.fire({
            title: 'Succès!',
            text: 'Inscription réussie!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Registration error:', error);
          let errorMessage = 'Erreur lors de l\'inscription.';
          console.log('Error response:', error); // Log de l'erreur complète
          if (error.error?.errors) {
            errorMessage += ' Détails : ' + JSON.stringify(error.error.errors);
          }
          Swal.fire({
            title: 'Erreur!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      const errorMessages = this.getErrorMessages();
      Swal.fire({
        title: 'Erreur!',
        text: errorMessages.join('\n'),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  // Nouvelle méthode pour récupérer les messages d'erreur
  private getErrorMessages(): string[] {
    const messages: string[] = [];

    // Validation LastName
    if (this.registerForm.get('LastName')?.hasError('required')) {
      messages.push('Le nom est requis.');
    }

    // Validation FirstName
    if (this.registerForm.get('FirstName')?.hasError('required')) {
      messages.push('Le prénom est requis.');
    }

    // Validation Adress
    if (this.registerForm.get('Adress')?.hasError('required')) {
      messages.push('L\'adresse est requise.');
    }

    // Validation Phone
    if (this.registerForm.get('Phone')?.hasError('required')) {
      messages.push('Le numéro de téléphone est requis.');
    }

    // Validation email
    if (this.registerForm.get('email')?.hasError('required')) {
      messages.push('L\'email est requis.');
    } else if (this.registerForm.get('email')?.hasError('email')) {
      messages.push('L\'email doit être un email valide.');
    }

    // Validation password
    if (this.registerForm.get('password')?.hasError('required')) {
      messages.push('Le mot de passe est requis.');
    }
    if (this.registerForm.get('password')?.hasError('minlength')) {
      messages.push('Le mot de passe doit contenir au moins 6 caractères.');
    }

    // Validation confirmation_password
    if (this.registerForm.get('confirmation_password')?.hasError('required')) {
      messages.push('La confirmation du mot de passe est requise.');
    } else if (this.registerForm.get('confirmation_password')?.value !== this.registerForm.get('password')?.value) {
      messages.push('La confirmation du mot de passe ne correspond pas.');
    }
    return messages;
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Assurez-vous que le service existe
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-newpass',
  standalone: true,
  imports: [NavbarComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './newpass.component.html',
  styleUrls: ['./newpass.component.css'],
})
export class NewpassComponent implements OnInit {
  newPasswordForm!: FormGroup;
  token!: string; // Pour capturer le token dans l'URL
  email!: string; // Si besoin, capturer l'email

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    });

    // Capturer le token depuis l'URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email']; // Si l'email est aussi passé dans l'URL
    });
  }

  onSubmit() {
    if (this.newPasswordForm.invalid) {
      return;
    }

    // Préparer les données à envoyer au backend
    const formData = {
      token: this.token,
      email: this.email,
      ...this.newPasswordForm.value, // Ajoute password et password_confirmation
    };

    // Appeler le service pour réinitialiser le mot de passe
    this.authService.resetPassword(formData).subscribe(
      (response) => {
        alert('Mot de passe réinitialisé avec succès.');
        this.router.navigate(['/connexion']); // Redirige vers la page de connexion
      },
      (error) => {
        alert('Erreur lors de la réinitialisation du mot de passe.');
      }
    );
  }
}

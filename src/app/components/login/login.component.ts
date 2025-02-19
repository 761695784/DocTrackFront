// login.component.ts
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocialAuthService, SocialUser, SocialLoginModule } from '@abacritt/angularx-social-login';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    SocialLoginModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showFinalizeForm = false;
  googleUser: any = {};
  formData: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private redirectService: RedirectService,
    private router: Router,
    private socialAuthService: SocialAuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // On s'abonne à l'état d'authentification.
    // Lorsque l'utilisateur se connecte via Google, la librairie renvoie un SocialUser.
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if (user && user.authToken) {  // Utilisez 'authToken' (et non idToken) pour Google
        // Vous pouvez stocker le token dans googleUser pour usage ultérieur (ex. finalisation)
        this.googleUser.token = user.authToken;
        this.handleGoogleLogin(user.authToken);
      }
    });
  }

  /**
   * Envoie le token Google au backend pour tenter une connexion.
   */
  handleGoogleLogin(token: string): void {
    this.authService.handleGoogleLogin(token).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Si la connexion est validée par le backend, on stocke le token JWT et on redirige.
          localStorage.setItem('token', response.token);
          this.router.navigate(['/accueil']);
        } else if (response.required_fields) {
          // Si des informations complémentaires sont requises, on affiche le formulaire de finalisation.
          this.showFinalizeForm = true;
          this.googleUser = response.google_user;
          this.formData = {
            email: this.googleUser.email,
            first_name: this.googleUser.first_name,
            last_name: this.googleUser.last_name
          };
        }
      },
      error: (err) => {
        console.error('Erreur de connexion Google:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Échec de la connexion avec Google. Veuillez réessayer.',
          icon: 'error',
          timer: 2000,
        });
      }
    });
  }

  /**
   * Connexion classique par email/mot de passe.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Connexion réussie',
            text: 'Bienvenue !',
            icon: 'success',
            timer: 2000,
          });
          localStorage.setItem('token', response.token);
          this.router.navigate(['/accueil']);
        },
        error: (err) => {
          Swal.fire({
            title: 'Échec de la connexion',
            text: 'Email ou mot de passe incorrect.',
            icon: 'error',
            timer: 2000,
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        timer: 2000,
      });
    }
  }

  /**
   * Envoi du formulaire de finalisation pour créer le compte.
   */
  submitFinalizeForm(): void {
    const payload = {
      email: this.formData.email,
      Adress: this.formData.Adress,
      Phone: this.formData.Phone,
      first_name: this.formData.first_name,
      last_name: this.formData.last_name,
      token: this.googleUser.token  // On renvoie le token initial pour revalider l'utilisateur Google
    };

    this.authService.finalizeAccountCreation(payload).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/accueil']);
      },
      error: (err) => {
        console.error('Erreur lors de la finalisation:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Échec de la finalisation de l\'inscription. Veuillez réessayer.',
          icon: 'error',
          timer: 2000,
        });
      }
    });
  }
}

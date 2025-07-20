import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'; // Importer SweetAlert2
import { NavbarComponent } from '../navbar/navbar.component';
import { RedirectService } from '../services/redirection.service'; // Importer RedirectService
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ajoutez cette ligne


})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false; // Variable pour contrôler l'affichage du loader
  isLocked: boolean = false; // Indique si l'utilisateur est bloqué
  lockoutTimeRemaining: number = 0; // Temps restant en secondes
  countdownInterval: any; // Pour le compte à rebours

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private redirectService: RedirectService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Vous pouvez effectuer des tâches d'initialisation ici
  }

  async loginWithGoogle() {
  }
  
  // Methode appelé lors du click du bouton submit
   onSubmit() {
    if (this.loginForm.valid && !this.isLocked) {
      this.isLoading = true; // Affichage du loader
      const loginData = this.loginForm.value;
      // Appel au service de connexion
      this.authService.login(loginData).subscribe(
        (response: any) => {
          this.isLoading = false; // Masquer le loader une fois l'opération terminée
          Swal.fire({
            title: 'Connexion réussie',
            text: 'Bienvenue !',
            icon: 'success',
            timer: 2000,
          }).then(() => {
            if (response.user && response.token) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
              localStorage.setItem('userId', response.user.id);
              const roles = response.user.roles || [];
              const isAdmin = roles.some((role: any) => role.name === 'Admin');
              if (isAdmin) {
                this.router.navigate(['/admin']);
              } else {
                const redirectUrl = this.redirectService.getRedirectUrl();
                this.redirectService.clearRedirectUrl();
                this.router.navigate([redirectUrl || '/accueil']);
              }
            }
          });
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 429) {
            this.isLocked = true;
            // Extraire le temps restant de manière plus robuste
            const message = error.error?.message || '';
            const timeMatch = message.match(/Veuillez attendre (\d+) secondes/);
            this.lockoutTimeRemaining = timeMatch ? parseInt(timeMatch[1], 10) : 300; // Par défaut 5 minutes (300 secondes)
            console.log('Temps restant extrait :', this.lockoutTimeRemaining); // Débogage
            if (this.lockoutTimeRemaining > 0) {
              this.startCountdown();
              Swal.fire({
                title: 'Trop de tentatives',
                text: `Veuillez attendre ${this.lockoutTimeRemaining} secondes avant de réessayer.`,
                icon: 'warning',
                timer: 3000,
              });
            }
          } else {
            Swal.fire({
              title: 'Échec de la connexion',
              text: error.error?.message || 'Email ou mot de passe incorrect.',
              icon: 'error',
              timer: 2000,
            });
          }
        }
      );
    } else if (this.isLocked) {
      Swal.fire({
        title: 'Compte bloqué',
        text: `Veuillez attendre ${this.lockoutTimeRemaining} secondes avant de réessayer.`,
        icon: 'warning',
        timer: 2000,
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

  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); // Arrêter l'ancien intervalle si existant
    }
    this.countdownInterval = setInterval(() => {
      if (this.lockoutTimeRemaining > 0) {
        this.lockoutTimeRemaining--;
        console.log('Temps restant :', this.lockoutTimeRemaining); // Débogage
      } else {
        this.isLocked = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

}

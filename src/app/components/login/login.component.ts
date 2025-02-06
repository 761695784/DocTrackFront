import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'; // Importer SweetAlert2
import { NavbarComponent } from '../navbar/navbar.component';
import { RedirectService } from '../services/redirection.service'; // Importer RedirectService
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

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
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      // Appel au service de connexion
      this.authService.login(loginData).subscribe(
        response => {
          Swal.fire({
            title: 'Connexion réussie',
            text: 'Bienvenue !',
            icon: 'success',
            timer: 2000,
          });
        },
        error => {
          Swal.fire({
            title: 'Échec de la connexion',
            text: 'Email ou mot de passe incorrect.',
            icon: 'error',
            timer: 2000,
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        timer: 2000,
      });
    }
  }

}

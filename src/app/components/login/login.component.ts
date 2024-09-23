import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'; // Importer SweetAlert2
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Vous pouvez effectuer des tâches d'initialisation ici
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      // Appelez votre service de connexion ici
      this.authService.login(loginData).subscribe(
        response => {
          // Supposons que votre API renvoie un token d'authentification
          localStorage.setItem('token', response.token); // Sauvegarder le token dans le localStorage
          Swal.fire({
            title: 'Connexion réussie',
            text: 'Bienvenue !',
            icon: 'success',
            confirmButtonText: 'Continuer'
          });
        // Stocker le token dans le localStorage
          localStorage.setItem('token', response.token); // Assurez-vous que `response.token` correspond à la structure de la réponse de votre API
        },
        error => {
          // Gérer les erreurs de connexion
          Swal.fire({
            title: 'Échec de la connexion',
            text: 'Email ou mot de passe incorrect.',
            icon: 'error',
            confirmButtonText: 'Réessayer'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonText: 'D\'accord'
      });
    }
  }
}

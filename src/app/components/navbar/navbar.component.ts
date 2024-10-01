import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  // Fonction pour rediriger vers la page de modification du mot de passe
  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  // Fonction pour se déconnecter
  logout(): void {
    this.authService.logout();
  }

}

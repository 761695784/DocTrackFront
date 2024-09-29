import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-sideheaders',
  standalone: true,
  imports: [SidebarComponent,CommonModule,FormsModule,NgbModule],
  templateUrl: './sideheaders.component.html',
  styleUrl: './sideheaders.component.css'
})
export class SideheadersComponent implements OnInit{

  FirstName: string = '';

  constructor(public authService: AuthService , private router: Router) {}

  ngOnInit() {
    this.FirstName = this.authService.getUserName(); // Récupérer le nom de l'utilisateur
  }

  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  // Méthode pour se déconnecter
  logout() {
    this.authService.logout();
    }

}

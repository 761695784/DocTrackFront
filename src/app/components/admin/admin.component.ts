import { AuthService } from './../services/auth.service';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SidebarComponent, SideheadersComponent,CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  emailLogs: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadEmailLogs();
  }

  loadEmailLogs() {
    this.authService.getAllEmailLogs().subscribe(
      (response) => {
        this.emailLogs = response.data; // Assurez-vous que la structure de la réponse correspond
      },
      (error) => {
        console.error('Erreur lors du chargement des logs d\'emails:', error);
      }
    );
  }
}

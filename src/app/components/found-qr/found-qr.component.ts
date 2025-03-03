import { NavbarComponent } from './../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-found-qr',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './found-qr.component.html',
  styleUrl: './found-qr.component.css'
})
export class FoundQrComponent implements OnInit {
  token: string = '';
  finderPhone: string = '';
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
      this.token = this.route.snapshot.queryParamMap.get('token') || '';
      // console.log('Token récupéré :', this.token); // Vérifie si le token est bien là
  }

  submitPhone() {
    if (this.finderPhone) {
      this.isLoading = true; // Active le loader
      const data = {
        token: this.token,
        finder_phone: this.finderPhone
      };

      const apiUrl = 'https://doctrackapi.malang2019marna.simplonfabriques.com/api/found-qr';

      this.http.post(apiUrl, data).subscribe({
        next: (response) => {
          this.isLoading = false; // Désactive le loader
          // console.log('Succès :', response);
          this.showSuccessAlert();
        },
        error: (error) => {
          this.isLoading = false; // Désactive le loader
          // console.error('Erreur :', error);
          this.showErrorAlert(error);
        }
      });
    }
  }

  private showSuccessAlert() {
    Swal.fire({
      title: 'Succès!',
      text: 'Le Proprietaire est Notifié !',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  private showErrorAlert(error: any) {
    Swal.fire({
      title: 'Erreur!',
      text: error.message || 'Une erreur est survenue',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
  navigateToHome() {
    this.router.navigate(['/accueil']);
  }
  }

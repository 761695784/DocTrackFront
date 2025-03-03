import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-qrcode',
  standalone: true,
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.css'
})
export class QrcodeComponent implements OnInit {
  qrCodeUrl: string | null = null;
  user: any;

  constructor(private authService: AuthService , private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        const backendUrl = 'http://localhost:8000'; // URL de ton backend
        this.qrCodeUrl = `${backendUrl}${response.qr_code_url}`; // Combine le domaine et l'URL relative
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du profil:', error);
      },
    });
  }

  printQrCode() {
    const printContents = document.querySelector('.qr-container')?.outerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  navigateToModify() {
    this.router.navigate(['/modify']);
  }
  }

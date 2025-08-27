import { Component } from '@angular/core';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';
import { DeclarationService } from '../services/declaration.service';
import { HttpClient } from '@angular/common/http';


export interface Certificat {

}


@Component({
  selector: 'app-admincertif',
  standalone: true,
  imports: [SideheadersComponent,CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './admincertif.component.html',
  styleUrl: './admincertif.component.css'
})
export class AdmincertifComponent {

  certificats: any[] = [];

  constructor(
    private declarationService: DeclarationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.chargerCertificats();
  }

  chargerCertificats(): void {
    this.declarationService.getCertificates().subscribe({
      next: (data) => this.certificats = data,
      error: (err) => console.error('Erreur de chargement des certificats:', err)
    });
  }


}

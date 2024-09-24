import { FooterComponent } from './../footer/footer.component';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent {

}

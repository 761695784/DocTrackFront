import { FooterComponent } from './../footer/footer.component';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {

  constructor() { }


}

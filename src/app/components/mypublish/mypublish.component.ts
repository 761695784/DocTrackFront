import { FooterComponent } from './../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mypublish',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './mypublish.component.html',
  styleUrl: './mypublish.component.css'
})
export class MypublishComponent {

}

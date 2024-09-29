import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SidebarComponent, SideheadersComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}

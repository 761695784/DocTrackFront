import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SideheadersComponent } from '../sideheaders/sideheaders.component';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, SideheadersComponent,  ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent implements OnInit {

  userForm!: FormGroup; // Formulaire pour ajouter un utilisateur

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      role: ['', Validators.required],
      FirstName: ['', [Validators.required, Validators.maxLength(40)]],
      LastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      Phone: ['', [Validators.required, Validators.maxLength(20)]],
      Adress: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      // Appel du service pour créer un utilisateur
      this.authService.addUser(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Utilisateur ajouté',
            text: 'L\'utilisateur a été ajouté avec succès !',
          });
          this.router.navigate(['/adminuser']); // Redirection après succès
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs requis.',
      });
    }
  }
}

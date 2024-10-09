import { SideheadersComponent } from './../sideheaders/sideheaders.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminprofil',
  standalone: true,
  imports: [SideheadersComponent,RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './adminprofil.component.html',
  styleUrl: './adminprofil.component.css'
})
export class AdminprofilComponent {

  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Adress: ['', Validators.required],
      Phone: ['', Validators.required],
      oldPassword: [''],
      newPassword: [''],
      newPasswordConfirm: ['']
    }, {
      validator: this.passwordMatchValidator // Ajout du validateur personnalisé
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.profileForm.patchValue({
        FirstName: parsedUser.FirstName || '',
        LastName: parsedUser.LastName || '',
        email: parsedUser.email || '',
        Adress: parsedUser.Adress || '',
        Phone: parsedUser.Phone || ''
      });
    }
  }

  // Méthode de validation pour vérifier si les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const newPasswordConfirm = form.get('newPasswordConfirm')?.value;

    return newPassword === newPasswordConfirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;
      const { oldPassword, newPassword } = profileData;

      // Mettre à jour les informations de profil
      this.authService.updateProfile(profileData).subscribe(
        (response) => {
          // console.log('Profil mis à jour', response);
          Swal.fire({
            icon: 'success',
            title: 'Profil mis à jour',
            text: 'Vos informations de profil ont été mises à jour avec succès !',
            confirmButtonText: 'Ok'
          });
        },
        (error) => {
          // console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la mise à jour du profil.',
            confirmButtonText: 'Ok'
          });
        }
      );

      // Vérifier si l'utilisateur souhaite changer son mot de passe
      if (oldPassword && newPassword) {
        this.authService.changePassword({
          current_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: profileData.newPasswordConfirm
        }).subscribe(
          (response) => {
            // console.log('Mot de passe changé', response);
            Swal.fire({
              icon: 'success',
              title: 'Mot de passe changé',
              text: 'Votre mot de passe a été changé avec succès !',
              confirmButtonText: 'Ok'
            });
          },
          (error) => {
            // console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors du changement de mot de passe.',
              confirmButtonText: 'Ok'
            });
          }
        );
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs requis.',
        confirmButtonText: 'Ok'
      });
    }
  }

}

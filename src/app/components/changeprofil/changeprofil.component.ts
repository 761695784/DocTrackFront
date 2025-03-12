import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { QrcodeComponent } from "../qrcode/qrcode.component";

@Component({
  selector: 'app-changeprofil',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule,],
  templateUrl: './changeprofil.component.html',
  styleUrls: ['./changeprofil.component.css'],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChangeprofilComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router) {
  /**
  * Construction du regles de validations des champs du formulaire de publication
  */
    this.profileForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Adress: ['', Validators.required],
      Phone: ['', Validators.required],
      oldPassword: [''],
      newPassword: [''],
      newPasswordConfirm: ['']},
     { validator: this.passwordMatchValidator });// Ajout du validateur personnalisé
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
      this.isLoading = true; // Chargement du spinner
      const profileData = this.profileForm.value;

      // Mettre à jour les informations de profil
      this.authService.updateProfile(profileData).subscribe(
        (response) => {
          this.isLoading = false; // Arrêt du spinner
          Swal.fire({
            icon: 'success',
            title: 'Profil mis à jour',
            text: 'Vos informations de profil ont été mises à jour avec succès !',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Redirection après la mise à jour du profil
            this.router.navigate(['/accueil']); // Remplacer par la route souhaitée
          });
        },
        (error) => {
          this.isLoading = false; // Arrêt du spinner
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la mise à jour du profil.',
            confirmButtonText: 'Ok'
          });
        }
      );

      // Vérifier si l'utilisateur souhaite changer son mot de passe
      if (profileData.oldPassword && profileData.newPassword) {
        // Chargement du spinner
        this.isLoading = true;
        this.authService.changePassword({
          current_password: profileData.oldPassword,
          new_password: profileData.newPassword,
          new_password_confirmation: profileData.newPasswordConfirm
        }).subscribe(
          (response) => {
            this.isLoading = false; // Arrêt du spinner
            Swal.fire({
              icon: 'success',
              title: 'Mot de passe changé',
              text: 'Votre mot de passe a été changé avec succès !',
              confirmButtonText: 'Ok'
            }).then(() => {
              // Redirection après le changement de mot de passe
              this.router.navigate(['/accueil']); // Remplacer par la route souhaitée
            });
          },
          (error) => {
            this.isLoading = false; // Arrêt du spinner
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

  redirectToFoundQR() {
    this.router.navigate(['/code']);
  }

}

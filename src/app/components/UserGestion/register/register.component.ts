import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  usernameTaken: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,    private toastr: ToastrService, // Ajoutez ToastrService ici
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });


  }
  
  checkUsernameAvailability() {
    const username = this.registerForm.get('name')?.value;
    if (username) {
      this.authService.isUsernameTaken(username).subscribe(
        (response) => {
          if (response.result == "ERROR") {
            this.usernameTaken = true;
            this.registerForm.get('name')?.setErrors({ usernameTaken: true });
          }
        }
      );
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      // Appeler le service d'inscription ici
      this.authService.register(name, email, password).subscribe((response) => {

        if (response.result == "OK") {
          // Rediriger l'utilisateur vers la page de connexion avec un message de succès
          this.toastr.success('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'Succès');
          this.router.navigate(['/login']); // Changez le chemin si nécessaire

          
          } else {
            // Afficher un message d'erreur
            
          };
      });
    }
  }


}

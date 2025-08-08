import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
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
    
    passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');
    
        // Vérifie si les mots de passe ne correspondent pas
        if (password && confirmPassword && password.value !== confirmPassword.value) {
          return { 'passwordMismatch': true };
        }
    
        return null;
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

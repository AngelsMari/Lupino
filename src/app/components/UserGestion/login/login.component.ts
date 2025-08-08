import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
	loginForm: FormGroup;
	error: boolean = false;

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			const email = this.loginForm.value.email;
			const password = this.loginForm.value.password;

			this.authService.login(email, password).subscribe({
				next: (data) => {
					this.toastr.success('Connexion réussie !', 'Succès');

					this.router.navigate(['/']);
				},
				error: () => {
					this.error = true;
					this.toastr.error('Erreur lors de la connexion', 'Erreur');
				},
			});
		}
	}
}

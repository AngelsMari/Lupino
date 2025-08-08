import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
    standalone: false
})
export class ResetPasswordComponent {
	resetForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private toastr: ToastrService, // Ajoutez ToastrService ici
	) {
		// get token from URL if needed
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		this.resetForm = this.fb.group(
			{
				token: [token], // Ajoutez le token si nécessaire
				password: ['', [Validators.required, Validators.minLength(6)]],
				confirmPassword: ['', Validators.required],
			},
			{ validator: this.passwordMatchValidator },
		);
	}

	passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');

		// Vérifie si les mots de passe ne correspondent pas
		if (password && confirmPassword && password.value !== confirmPassword.value) {
			return { passwordMismatch: true };
		}

		return null;
	}

	onSubmit(): void {
		if (this.resetForm.valid) {
			const { password, token } = this.resetForm.value;
			// Appeler le service de réinitialisation du mot de passe ici
			this.userService.resetPassword(password, token).subscribe((data) => {
				if (data.result === 'OK') {
					this.toastr.info(
						'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
						'Réinitialisation du mot de passe',
					);
					// Rediriger vers la page de connexion ou une autre page appropriée
					this.router.navigate(['/login']);
				}
			});
		}
	}
}

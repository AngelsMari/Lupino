import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-password-forgotten',
    templateUrl: './password-forgotten.component.html',
    styleUrl: './password-forgotten.component.css',
    standalone: false
})
export class PasswordForgottenComponent {
	forgotForm: FormGroup;
	error: boolean = false;

	constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router) {
		this.forgotForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
		});
	}

	onSubmit() {
		if (this.forgotForm.valid) {
			this.userService.sendForgotPasswordEmail(this.forgotForm.value.email).subscribe((data) => {
				if (data.result === 'OK') {
					this.toastr.info(
						"Un email de réinitialisation de mot de passe a été envoyé à l'adresse fournie.",
						'Réinitialisation du mot de passe',
					);
					// Rediriger vers la page de connexion ou une autre page appropriée
					this.router.navigate(['/login']);
				}
			});
		} else {
			this.error = true;
		}
	}
}

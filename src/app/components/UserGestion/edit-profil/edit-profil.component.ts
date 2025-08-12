import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPublicData } from 'app/models/userpublicdata';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, take } from 'rxjs/operators';

@Component({
	selector: 'edit-profil',
	templateUrl: './edit-profil.component.html',
	styleUrls: ['./edit-profil.component.css'],
	standalone: false,
})
export class EditProfilComponent implements OnInit {
	user$: Observable<UserPublicData>;

	profileForm: FormGroup;

	currentPassword = '';
	newPassword = '';
	confirmPassword = '';
	usernameTaken = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private toastr: ToastrService,
		private userService: UserService,
		private fb: FormBuilder,
	) {
		this.user$ = this.userService.getUserData();

		// Initialisation du formulaire vide
		this.profileForm = this.fb.group({
			name: ['', Validators.required],
			mail: ['', [Validators.required, Validators.email]],
			// autres champs si besoin...
		});
	}

	ngOnInit(): void {
		// Dès qu'on reçoit un nouvel utilisateur, on patch le formulaire sans stocker localement
		this.user$.subscribe((user) => {
			this.profileForm.patchValue({
				name: user.name,
				mail: user.mail,
				// autres champs...
			});
		});
	}

	updateUserInfo(): void {
		if (this.profileForm.invalid) {
			this.toastr.warning('Veuillez remplir correctement le formulaire.');
			return;
		}

		// On récupère la valeur du formulaire
		const updatedUser: UserPublicData = {
			...this.profileForm.value,
			_id: '', // ou récupérer ID via user$ si nécessaire (voir plus bas)
			isAdmin: false, // à ajuster selon ton besoin
			isSuperAdmin: false,
			isMJ: false,
		};

		// Pour récupérer l'ID de l'utilisateur actuel, on prend la dernière valeur émise par user$
		this.user$.pipe(take(1)).subscribe((user) => {
			updatedUser._id = user._id;

			this.authService.updateUserInfo(updatedUser).subscribe((response) => {
				if (response.result === 'OK') {
					this.toastr.success('Profil modifié avec succès!');
					// Rafraichir user$, optionnel selon ta logique backend
					// Par exemple, forcer un reload ou mettre à jour le service userService
				} else {
					this.toastr.error('Erreur lors des modifications.');
				}
			});
		});
	}

	changePassword(): void {
		if (this.newPassword !== this.confirmPassword) {
			this.toastr.warning('Les mots de passe ne correspondent pas.');
			return;
		}

		if (this.newPassword.length < 6) {
			this.toastr.warning('Le mot de passe doit contenir au moins 6 caractères.');
			return;
		}

		this.authService.changePassword(this.currentPassword, this.newPassword).subscribe((response) => {
			if (response.result === 'OK') {
				this.toastr.success('Mot de passe changé avec succès!');
				this.currentPassword = '';
				this.newPassword = '';
				this.confirmPassword = '';
			} else {
				this.toastr.error('Erreur lors du changement de mot de passe.');
				this.currentPassword = '';
				this.newPassword = '';
				this.confirmPassword = '';
			}
		});
	}

	deleteAccount(): void {
		if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Attention, tous vos personnages seront supprimés.')) {
			this.authService.deleteAccount().subscribe((response) => {
				if (response.result === 'OK') {
					this.toastr.success('Compte supprimé avec succès!');
					this.authService.logout().subscribe(() => this.router.navigate(['/']));
				} else {
					this.toastr.error('Erreur lors de la suppression du compte.');
				}
			});
		}
	}

	checkUsernameAvailability(): void {
		const name = this.profileForm.get('name')?.value;

		this.user$.pipe(take(1)).subscribe((user) => {
			if (name === user.name) {
				this.usernameTaken = false;
				return;
			}

			this.authService.isUsernameTaken(name).subscribe((response) => {
				this.usernameTaken = response.result === 'ERROR';
				if (this.usernameTaken) {
					this.toastr.warning('Nom d’utilisateur déjà pris.');
				}
			});
		});
	}
}

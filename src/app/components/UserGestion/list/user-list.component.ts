import { Component } from '@angular/core';
import { UserPublicData } from '../../../models/userPublicData';
import { UserService } from 'app/services/LupinoApi/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-user-bestiary-entry-list',
	templateUrl: './user-list.component.html',
	styleUrl: './user-list.component.css',
})
export class UserListComponent {
	users: UserPublicData[] = [];

	constructor(
		private userService: UserService,
		private toastr: ToastrService,
	) {}

	ngOnInit(): void {
		this.loadUsers();
	}

	loadUsers(): void {
		this.userService.getUsers().subscribe((data) => {
			// Handle error

			this.users = data;
		});
	}

	toggleMj(user: UserPublicData): void {
		const nextValue = !user.isMJ;

		this.userService.toggleMj(user._id, nextValue).subscribe({
			next: () => {
				user.isMJ = nextValue;
				this.toastr.success(
					nextValue ? 'Utilisateur promu MJ' : 'Utilisateur rétrogradé MJ',
				);
			},
			error: () => this.toastr.error('Erreur lors de la mise à jour du rôle MJ'),
		});
	}

	toggleAdminRole(user: UserPublicData): void {
		const nextValue = !user.isAdmin;

		this.userService.toggleAdmin(user._id, nextValue).subscribe({
			next: () => {
				user.isAdmin = nextValue;
				this.toastr.success(
					nextValue ? 'Utilisateur promu Admin' : 'Utilisateur rétrogradé Admin',
				);
			},
			error: () => this.toastr.error('Erreur lors de la mise à jour du rôle Admin'),
		});
	}

	suspendUser(user: UserPublicData): void {
		this.userService.suspendUser(user._id).subscribe({
			next: () => {
				this.users = this.users.filter((u) => u._id !== user._id);
				this.toastr.success('Utilisateur suspendu');
			},
			error: () => this.toastr.error('Erreur lors de la suspension'),
		});
	}
}

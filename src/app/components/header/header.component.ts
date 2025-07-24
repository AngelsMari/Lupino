import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrl: './header.component.css',
})
export class HeaderComponent {
	isLoggedIn: boolean = false;
	isAdmin: boolean = false;

	constructor(private authService: AuthService, private userService: UserService) {}

	async ngOnInit() {
		await this.checkIfLoggedIn();
		await this.checkIfAdmin();
	}

	async checkIfLoggedIn(): Promise<void> {
		this.isLoggedIn = await this.authService.isLoggedIn();
	}

	async checkIfAdmin(): Promise<void> {
		this.userService.getUserData().subscribe((data) => {
			this.isAdmin = data.isAdmin;
		});
	}

	logout() {
		this.authService.logout().subscribe((data) => {
			this.checkIfLoggedIn();

			console.log('data', data);
			document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Ajustez le nom du cookie si nécessaire
			sessionStorage.removeItem('token'); // Optionnel : supprimer le token du sessionStorage si nécessaire
			sessionStorage.removeItem('user_id'); // Supprimer l'ID utilisateur du sessionStorage si nécessaire
		});
	}
}

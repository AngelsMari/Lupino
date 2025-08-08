import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'Lupino';

	constructor(private authService: AuthService) {}

	ngOnInit() {
		// Appeler une méthode du UserService pour s'assurer qu'il est chargé
		this.authService.autoLogin();
	}
}

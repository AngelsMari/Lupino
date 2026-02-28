import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [HeaderComponent, RouterOutlet, FooterComponent]
})
export class AppComponent {
	title = 'Lupino';

	constructor(private authService: AuthService) {}

	ngOnInit() {
		// Appeler une méthode du UserService pour s'assurer qu'il est chargé
		this.authService.autoLogin();
	}
}

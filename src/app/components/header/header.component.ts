import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { OrnementComponent } from '../../shared/ornement/ornement';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	imports: [OrnementComponent, AsyncPipe, RouterLink],
	standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
	router = inject(Router);
	isLoggedIn$ = this.authService.loggedIn$; // Observable<boolean>
	isAdmin$ = this.userService.getUserData().pipe(map((user) => user?.isAdmin ?? false));
	private destroy$ = new Subject<void>();

	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	ngOnInit() {}

	logout() {
		this.authService.logout().subscribe({
			next: () => {
				console.log('Déconnexion réussie');
			},
		});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

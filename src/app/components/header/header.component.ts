import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	isLoggedIn$ = this.authService.loggedIn$; // Observable<boolean>
	isAdmin$ = this.userService.getUserData().pipe(map((user) => user?.isAdmin ?? false));

	constructor(private authService: AuthService, private userService: UserService) {}

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

import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private toastr: ToastrService,
	) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
		return this.authService.loggedIn$.pipe(
			filter((val): val is boolean => val !== null), // on ignore tant que ce n'est pas défini
			take(1),
			tap((isLoggedIn) => {
				if (!isLoggedIn) {
					this.toastr.error('Vous devez être connecté pour accéder à cette page', 'Erreur');
				}
			}),
			map((isLoggedIn) => (isLoggedIn ? true : this.router.createUrlTree(['/login']))),
			catchError(() => of(this.router.createUrlTree(['/login']))),
		);
	}
}

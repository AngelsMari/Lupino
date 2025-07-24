import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
		return this.authService.getCurrentUser().pipe(
			take(1),
			map((res: any) => res?.result === 'OK'),
			tap((logged) => {
				if (!logged) {
					this.toastr.error('Vous devez être connecté pour accéder à cette page', 'Erreur');
				}
			}),
			map((logged) => (logged ? true : this.router.createUrlTree(['/login'], { queryParams: { redirect: state.url } }))),
			catchError(() => of(this.router.createUrlTree(['/login'], { queryParams: { redirect: state.url } }))),
		);
	}
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
		return this.authService.getCurrentUser().pipe(
			take(1),
			map((res: any) => {
				// Si l'utilisateur est déjà connecté, on le renvoie sur la page d'accueil
				if (res?.result === 'OK') {
					return this.router.createUrlTree(['/']);
				}
				return true;
			}),
			catchError(() => of(true)), // En cas d'erreur API, on autorise l'accès (comme si non connecté)
		);
	}
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

	canActivate(): Observable<boolean | UrlTree> {
		return this.authService.loggedIn$.pipe(
			take(1),
			map((loggedIn) => {
				if (loggedIn) {
					return this.router.createUrlTree(['/']);
				}
				return true;
			}),
		);
	}
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../LupinoApi/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private router: Router, private toastr: ToastrService, private userService: UserService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.userService.getUserData().pipe(
			take(1), // Prendre seulement la première émission
			map((userData) => {
				if (userData && userData.isAdmin) {
					return true; // Autoriser l'accès si l'utilisateur est admin
				} else {
					this.toastr.error('Vous devez être administrateur pour accéder à cette page', 'Error');
					this.router.navigate(['/']); // Rediriger vers une autre page si l'utilisateur n'est pas admin
					return false; // Bloquer l'accès
				}
			}),
		);
	}
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../LupinoApi/user.service';

@Injectable()
export class MJGuard implements CanActivate {
	constructor(
		private router: Router,
		private toastr: ToastrService,
		private userService: UserService,
	) {}

	canActivate(): Observable<boolean> {
		return this.userService.isUserLoaded().pipe(
			take(1),
			switchMap((loaded) => {
				if (loaded) {
					return this.userService.getUserData().pipe(take(1));
				}

				this.router.navigate(['/']);
				return of(null);
			}),
			map((userData) => {
				if (userData?.isAdmin || userData?.isSuperAdmin || userData?.isMJ) {
					return true;
				}

				this.toastr.error(
					'Vous devez être Maître de jeu pour accéder à cette page',
					'Error',
				);
				this.router.navigate(['/']);
				return false;
			}),
		);
	}
}

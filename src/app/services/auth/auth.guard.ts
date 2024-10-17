import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map((isLoggedIn: any) => {
        if (isLoggedIn.result !== 'OK') {
          this.toastr.error('Vous devez être connecté pour accéder à cette page', 'Error',);
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone la requête et ajoute l'option withCredentials: true
        const modifiedReq = req.clone({
            withCredentials: true
        });

        // Passe la requête modifiée au prochain handler
        return next.handle(modifiedReq);
    }
}

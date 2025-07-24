import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environements'; // Ajustez le chemin si nécessaire
import { AuthService } from '../auth/auth.service';
import { UserPublicData } from 'app/models/userpublicdata';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private apiUrl = environment.apiUrl + '/user'; // Assure-toi que cette URL correspond à ton API
	private userData = new BehaviorSubject<UserPublicData>({ _id: '', name: '', mail: '', isAdmin: false, isSuperAdmin: false, isMJ: false });
	private userLoadedSubject = new BehaviorSubject<boolean>(false); // Ajoutez un sujet pour indiquer que l'utilisateur est chargé

	constructor(private http: HttpClient, private authService: AuthService) {
		this.loadCurrentUser(); // Charger au démarrage
	}

	getUserById(id: string): Observable<User> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<User>(this.apiUrl + '/get', { id }, { headers: headers });
	}

	getUsers(): Observable<User[]> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.get<User[]>(this.apiUrl + '/list', { headers: headers });
	}

	private loadCurrentUser(): void {
		this.authService.getCurrentUser().subscribe((data) => {
			if (data?.result !== 'ERROR') {
				const user = data.items[0].object;
				this.userData.next({
					_id: user._id || '', // Assurez-vous que '_id' est présent
					name: user.name || '', // Utilisez une chaîne vide par défaut
					mail: user.mail || '', // Utilisez une chaîne vide par défaut
					isAdmin: user.isAdmin || false, // Utilisez false par défaut
					isSuperAdmin: user.isSuperAdmin || false, // Utilisez false par défaut
					isMJ: user.isMJ || false, // Utilisez false par défaut
				});
				this.userLoadedSubject.next(true); // Émettre que l'utilisateur est chargé
			}
		});
	}

	isUserLoaded(): Observable<boolean> {
		return this.userLoadedSubject.asObservable();
	}

	getUserData(): Observable<{ _id: string; name: string; mail: string; isAdmin: boolean; isSuperAdmin: boolean; isMJ: boolean }> {
		return this.userData.asObservable();
	}

	sendForgotPasswordEmail(email: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		console.log('Sending forgot password email to:', email);
		return this.http.post<any>(this.apiUrl + '/forgot-password', { email }, { headers });
	}

	resetPassword(password: any, token?: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<any>(this.apiUrl + '/reset-password', { password, token }, { headers });
	}
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environements';
import { UserService } from '../LupinoApi/user.service';
import { User } from 'app/models/user';
import { UserPublicData } from 'app/models/userpublicdata';

@Injectable()
export class AuthService {
	private apiUrl = environment.apiUrl + '/user';

	userService = inject(UserService);

	private loggedInSubject = new BehaviorSubject<boolean>(false);
	public loggedIn$ = this.loggedInSubject.asObservable();

	constructor(private router: Router, private http: HttpClient) {}

	autoLogin(): void {
		this.http.get<UserPublicData>(`${this.apiUrl}/currentUser`, { withCredentials: true }).subscribe({
			next: (user) => {
				this.loggedInSubject.next(true);
				this.userService.setUserData(user);
			},
			error: () => {
				this.userService.clearUserData();
			},
		});
	}

	login(email: string, password: string): Observable<UserPublicData> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<UserPublicData>(`${this.apiUrl}/login`, { mail: email, password: password }, { headers }).pipe(
			tap((user) => {
				if (user) {
					// Notifier loggedIn
					this.loggedInSubject.next(true);
					// Mettre à jour UserService avec les données utilisateur reçues
					this.userService.setUserData(user);
				} else {
					this.loggedInSubject.next(false);
					this.userService.clearUserData();
				}
			}),
		);
	}

	logout(): Observable<any> {
		return this.http.get(`${this.apiUrl}/logout`).pipe(
			tap(() => {
				document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				sessionStorage.removeItem('token');
				sessionStorage.removeItem('user_id');
				this.loggedInSubject.next(false); // Notifie que user est déconnecté
				this.userService.clearUserData(); // Vide les données utilisateur si tu as un UserService
				this.router.navigate(['/login']); // Redirige vers la page de connexion
			}),
		);
	}

	register(name: string, mail: string, password: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post(`${this.apiUrl}/register`, { name, mail, password }, { headers });
	}

	changePassword(currentPassword: string, newPassword: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<any>(`${this.apiUrl}/change-password`, { currentPassword, newPassword }, { headers });
	}

	get(id: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });

		return this.http.post(`${this.apiUrl}/get`, id, { headers: headers });
	}

	deleteAccount(): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });

		return this.http.post(`${this.apiUrl}/delete`, {}, { headers: headers });
	}

	isUsernameTaken(username: any): Observable<any> {
		return this.http.get(`${this.apiUrl}/check-username?username=${username}`);
	}

	updateUserInfo(user: any): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });

		return this.http.post(`${this.apiUrl}/update`, user, { headers: headers });
	}
}

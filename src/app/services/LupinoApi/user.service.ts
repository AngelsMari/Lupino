import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environements';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/user';
import { UserPublicData } from 'app/models/userpublicdata';

@Injectable({ providedIn: 'root' })
export class UserService {
	private apiUrl = environment.apiUrl + '/user';

	// State utilisateur
	private currentUserSubject = new BehaviorSubject<UserPublicData>({
		_id: '',
		name: '',
		mail: '',
		isAdmin: false,
		isSuperAdmin: false,
		isMJ: false,
	});
	private userLoadedSubject = new BehaviorSubject<boolean>(false);

	constructor(private http: HttpClient) {}

	// ===== API UTILISATEURS =====
	getUserById(id: string): Observable<User> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<User>(`${this.apiUrl}/get`, { id }, { headers });
	}

	getUsers(): Observable<User[]> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.get<User[]>(`${this.apiUrl}/list`, { headers });
	}

	sendForgotPasswordEmail(email: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email }, { headers });
	}

	resetPassword(password: string, token?: string): Observable<any> {
		const headers = new HttpHeaders({ Accept: 'application/json' });
		return this.http.post<any>(`${this.apiUrl}/reset-password`, { password, token }, { headers });
	}

	// ===== STATE UTILISATEUR =====
	getUserData(): Observable<UserPublicData> {
		return this.currentUserSubject.asObservable();
	}

	isUserLoaded(): Observable<boolean> {
		return this.userLoadedSubject.asObservable();
	}

	setUserData(user: UserPublicData): void {
		this.currentUserSubject.next(user);
		this.userLoadedSubject.next(true);
	}

	clearUserData() {
		this.currentUserSubject.next({
			_id: '',
			name: '',
			mail: '',
			isAdmin: false,
			isSuperAdmin: false,
			isMJ: false,
		});
		this.userLoadedSubject.next(false);
	}
}

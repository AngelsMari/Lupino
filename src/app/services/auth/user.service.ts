import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserPublicData } from 'app/models/userpublicdata';

@Injectable({ providedIn: 'root' })
export class UserService {
	private currentUserSubject = new BehaviorSubject<UserPublicData | null>(null);

	constructor() {
		// Option : récupérer user depuis token/localStorage si dispo
	}

	getUserData(): Observable<UserPublicData | null> {
		return this.currentUserSubject.asObservable();
	}

	setUserData(user: UserPublicData) {
		this.currentUserSubject.next(user);
	}

	clearUserData() {
		this.currentUserSubject.next(null);
	}
}

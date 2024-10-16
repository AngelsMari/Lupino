import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private apiUrl = environment.apiUrl+'/user'; // Assure-toi que cette URL correspond à ton API
	
	
	constructor(private http: HttpClient) { }
	
	getUserById(id: string): Observable<User> {
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.post<User>(this.apiUrl+'/get', {id}, {'headers' : headers});
	}
	
	getUsers(): Observable<User[]> {
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.get<User[]>(this.apiUrl+'/list', {'headers' : headers});
	}
}

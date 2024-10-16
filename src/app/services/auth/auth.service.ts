import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';
import { environment } from '../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable()
@Injectable()
export class AuthService {
    
    private apiUrl = environment.apiUrl+'/user'; // Assure-toi que cette URL correspond à ton API
    
    public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    get isLoggedIn() {
        if (sessionStorage.getItem("token")){
            this.loggedIn.next(true);
        }else{
            this.loggedIn.next(false);
            
        }
        return this.loggedIn.asObservable();
    }
    
    constructor(
        private router: Router,private http: HttpClient
    ) {}
    
    login(email : string, password:string): Observable<any> {
        const headers= new HttpHeaders({'Accept': 'application/json'});

        // Envoi des données au serveur
        return this.http.post(`${this.apiUrl}/login`, {"mail":email, "password":password},{'headers' : headers} );
    }
    
    logout() {
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
    
    register(name : string, mail:string, password:string): Observable<any> {
        const headers= new HttpHeaders({'Accept': 'application/json'});

        
        // Envoi des données au serveur
        return this.http.post(`${this.apiUrl}/register`, {"name":name, "mail":mail, "password":password},{'headers' : headers} );
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        const headers= new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'Accept': 'application/json'});

        return this.http.post<User>(`${this.apiUrl}/change-password`, {"currentPassword": currentPassword, "newPassword": newPassword}, {'headers' : headers});
    }

    get(id: string): Observable<any> {
        const headers= new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'Accept': 'application/json'});

        return this.http.post(`${this.apiUrl}/get`,  id, {'headers' : headers});
    }

    deleteAccount(): Observable<any> {
        const headers= new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'Accept': 'application/json'});

        return this.http.post(`${this.apiUrl}/delete`,  id, {'headers' : headers});
    }

    isUsernameTaken(username: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/check-username?username=${username}`);
    }

    updateUserInfo(user: User): Observable<any> {
        const headers= new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'Accept': 'application/json'});

        return this.http.post(`${this.apiUrl}/update`, user, {'headers' : headers});
    }
}
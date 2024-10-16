import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilitaire } from '../../../models/items/utilitaire';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
    providedIn: 'root'
})
export class UtilitaireService {
    private apiUrl = environment.apiUrl+'/utilitaire'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<Utilitaire> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.post<Utilitaire>(this.apiUrl+'/get', {id}, {'headers' : headers});
  }

  getUtilitaires(): Observable<Utilitaire[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.http.get<Utilitaire[]>(`${this.apiUrl}/list`, {'headers' : headers});
  }

  create(utilitaire: Utilitaire): Observable<Utilitaire> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${sessionStorage.getItem('token')}`,'Accept': 'application/json'});

    return this.http.post<Utilitaire>(this.apiUrl+'/create', {utilitaire}, {'headers' : headers});
  }
}

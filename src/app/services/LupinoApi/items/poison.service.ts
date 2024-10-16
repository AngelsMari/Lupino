import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Poison } from '../../../models/items/poison';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class PoisonService {
  private apiUrl = environment.apiUrl+'/poison'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<Poison> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.post<Poison>(this.apiUrl+'/get', {id}, {'headers' : headers});
  }

  getPoisons(): Observable<Poison[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.http.get<Poison[]>(`${this.apiUrl}/list`, {'headers' : headers});
  }

  create(poison: Poison): Observable<Poison> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${sessionStorage.getItem('token')}`,'Accept': 'application/json'});

    return this.http.post<Poison>(this.apiUrl+'/create', {poison}, {'headers' : headers});
  }
}

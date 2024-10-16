import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contenant } from '../../../models/items/contenant';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class ContenantService {
  private apiUrl = environment.apiUrl+'/contenant'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<Contenant> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.post<Contenant>(this.apiUrl+'/get', {id}, {'headers' : headers});
  }

  getContenant(): Observable<Contenant[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.http.get<Contenant[]>(`${this.apiUrl}/list`, {'headers' : headers});
  }

  create(contenant: Contenant): Observable<Contenant> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${sessionStorage.getItem('token')}`,'Accept': 'application/json'});

    return this.http.post<Contenant>(this.apiUrl+'/create', {contenant}, {'headers' : headers});
  }
}

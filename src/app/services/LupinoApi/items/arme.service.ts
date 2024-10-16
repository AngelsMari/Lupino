import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Arme } from '../../../models/items/arme';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class ArmeService {
 
  private apiUrl = environment.apiUrl+'/arme'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<Arme> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.post<Arme>(this.apiUrl+'/get', {id}, {'headers' : headers});
  }

  getArmes(): Observable<Arme[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.http.get<Arme[]>(`${this.apiUrl}/list`, {'headers' : headers});
  }

  create(arme: Arme): Observable<Arme> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${sessionStorage.getItem('token')}`,'Accept': 'application/json'});
    return this.http.post<Arme>(this.apiUrl+'/create', {arme}, {'headers' : headers});
  }
  
}

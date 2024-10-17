import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bazar } from '../../../models/items/bazar';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class BazarService {
  private apiUrl = environment.apiUrl+'/bazar'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<Bazar> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.post<Bazar>(this.apiUrl+'/get', {id}, {'headers' : headers});
  }

  getBazars(): Observable<Bazar[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.http.get<Bazar[]>(`${this.apiUrl}/list`, {'headers' : headers});
  }

  create(bazar: Bazar): Observable<Bazar> {
    const headers = new HttpHeaders({ 'Accept': 'application/json'});

    return this.http.post<Bazar>(this.apiUrl+'/create', {bazar}, {'headers' : headers});
  }
}

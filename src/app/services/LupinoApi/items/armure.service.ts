import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Armure } from '../../../models/items/armure';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class ArmureService {
  private apiUrl = environment.apiUrl+'/armure'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<Armure> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.post<Armure>(this.apiUrl+'/get', {id}, {'headers' : headers});
  }

  getArmures(): Observable<Armure[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});
    return this.http.get<Armure[]>(`${this.apiUrl}/list`, {'headers' : headers});
  }

  create(armure: Armure): Observable<Armure> {
    const headers = new HttpHeaders({ 'Accept': 'application/json'});

    return this.http.post<Armure>(this.apiUrl+'/create', {armure}, {'headers' : headers});
  }
}

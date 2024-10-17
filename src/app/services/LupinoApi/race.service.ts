import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Race } from '../../models/race';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  
  private apiUrl = environment.apiUrl+'/race'; // Assure-toi que cette URL correspond à ton API


  constructor(private http: HttpClient) { }

  getRaces(): Observable<Race[]> {
const headers = new HttpHeaders({'Accept': 'application/json'});    return this.http.get<Race[]>(this.apiUrl+'/list', { 'headers': headers });
  }

  createRace(newRace: Race) {
    const headers = new HttpHeaders({ 'Accept': 'application/json'});
    return this.http.post<Race>(this.apiUrl+'/create', {newRace}, { 'headers': headers });
  }

}

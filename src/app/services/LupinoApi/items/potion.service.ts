import { Injectable } from '@angular/core';
import { Potion } from '../../../models/items/potion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Armure } from '../../../models/items/armure';
import { environment } from '../../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
    providedIn: 'root'
})
export class PotionService {
    private apiUrl = environment.apiUrl+'/potion'; // Assure-toi que cette URL correspond à ton API
    
    
    constructor(private http: HttpClient) { }
    
    getUserById(id: string): Observable<Potion> {
    const headers = new HttpHeaders({'Accept': 'application/json'});        return this.http.post<Potion>(this.apiUrl+'/get', {id}, {'headers' : headers});
    }
    
    getPotions(): Observable<Potion[]> {
    const headers = new HttpHeaders({'Accept': 'application/json'});        
        return this.http.get<Potion[]>(`${this.apiUrl}/list`, {'headers' : headers});
    }
    
    create(potion: Potion): Observable<Potion> {
        const headers = new HttpHeaders({ 'Accept': 'application/json'});

        return this.http.post<Potion>(this.apiUrl+'/create', {potion}, {'headers' : headers});
    }
}

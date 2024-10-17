import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Campagne, Note } from '../../models/campagne';
import { environment } from '../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
	providedIn: 'root'
})
export class CampagneService {
	private apiUrl = environment.apiUrl+'/campagne'; // Assure-toi que cette URL correspond à ton API
	
	
	constructor(private http: HttpClient) { }
	
	getCampagneById(id: string): Observable<Campagne> {
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.post<Campagne>(this.apiUrl+'/get',  {id}, {'headers' : headers});
	}
	
	getCampagnes(): Observable<Campagne[]> {
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.get<Campagne[]>(this.apiUrl+'/list', {'headers' : headers});
	}

	getCampagnesByUser(id:any) : Observable<Campagne[]> {
		const headers= new HttpHeaders({'Accept': 'application/json'});
		return this.http.post<Campagne[]>(`${this.apiUrl}/list`,{id},{'headers' : headers});
	}

	deleteCampagne(id: string): Observable<Campagne> {
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.post<Campagne>(this.apiUrl+'/delete', {id}, {'headers' : headers});
	}
	
	create(campagne: Campagne): Observable<Campagne> {
		console.log(campagne);
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.post<Campagne>(this.apiUrl+'/create', campagne, {'headers' : headers});
	}

	addNoteToCampagne(campagneId: string, note: Note): Observable<Campagne> {
		const headers = new HttpHeaders({ 'Accept': 'application/json'});
		return this.http.post<Campagne>(this.apiUrl+'/addnote', {id: campagneId, note: note}, {'headers' : headers});
	}
}

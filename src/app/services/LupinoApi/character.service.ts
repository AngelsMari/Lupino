import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Character } from '../../models/character';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environements'; // Ajustez le chemin si nécessaire

@Injectable({
	providedIn: 'root'
})
export class CharacterService {
    
	private apiUrl = environment.apiUrl+'/character'; // Assure-toi que cette URL correspond à ton API


	getCharacterById(id: string) : Observable<Character>{
		const headers= new HttpHeaders({'Accept': 'application/json'});
		return this.http.post<Character>(this.apiUrl+"/get",{id}, {'headers' : headers});
	}

	constructor(private http: HttpClient) { }

	getCharacters() : Observable<Character[]>{
		const headers= new HttpHeaders({'Accept': 'application/json'});

		return this.http.get<Character[]>(`${this.apiUrl}/list`,{'headers' : headers});
	}

	getCharactersByUser(id:any) : Observable<Character[]> {
		const headers= new HttpHeaders({'Accept': 'application/json'});
		return this.http.post<Character[]>(`${this.apiUrl}/list`,{id},{'headers' : headers});
	}

	deleteCharacter (id:string)  {
		const headers= new HttpHeaders({'Accept': 'application/json'});
		return this.http.post<Character>(`${this.apiUrl}/delete`,{id},{'headers' : headers});
	}

	createCharacter(character: Character) : Observable<Character>{
		const headers= new HttpHeaders({'Accept': 'application/json'});
		return this.http.post<Character>(this.apiUrl+'/create',character,{'headers' : headers});
	}

	updateCharacter(character: Character) {
		const headers= new HttpHeaders({'Accept': 'application/json'});
		console.log(character);
		return this.http.post<Character>(this.apiUrl+'/update',character,{'headers' : headers});

    }

	uploadImage(file: File) : any{
		const headers= new HttpHeaders({'Accept': 'application/json'});
		const formData = new FormData();
		formData.append('file', file); // Ajoutez le fichier au FormData
		return this.http.post<any>(this.apiUrl+'/upload',formData,{'headers' : headers});

		
    }

}

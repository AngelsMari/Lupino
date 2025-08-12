import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from 'app/services/LupinoApi/user.service';
import { UserPublicData } from 'app/models/userpublicdata';

@Component({
	selector: 'app-characters',
	templateUrl: './characters.component.html',
	styleUrl: './characters.component.css',
	standalone: false,
})
export class CharactersComponent {
	currentUser$ = this.userService.getUserData().pipe(filter(Boolean), shareReplay(1));

	allCharacters$!: Observable<Character[]>; // Source brute
	characters$!: Observable<Character[]>;
	isMyCharacterPage = this.router.url === '/mycharacters';

	filters = {
		ageRange: [0, 1000], // minAge = 0, maxAge = 1000
		levelRange: [1, 10], // idem pour le level
		races: [] as string[], // races sélectionnées
	};

	// Toutes les races possibles (à ajuster selon ta data)
	races = ['Humain', 'Elfe', 'Nain', 'Orc', 'Drakéide', 'Gobelin'];

	filtersSubject$ = new BehaviorSubject(this.filters);

	constructor(
		private characterService: CharacterService,
		private modalService: NgbModal,
		private router: Router,
		private userService: UserService,
	) {
		this.loadCharacter();

		this.characters$ = combineLatest([this.allCharacters$, this.filtersSubject$]).pipe(
			map(([characters, filters]) => {
				return characters.filter((character) => {
					console.log(character);
					const ageNum = parseInt(character.age.toString(), 10);
					const ageOk = !isNaN(ageNum) && ageNum >= filters.ageRange[0] && ageNum <= filters.ageRange[1];
					const levelOk = character.level >= filters.levelRange[0] && character.level <= filters.levelRange[1];

					// Pour la race aussi si tu veux filtrer par race
					const raceOk = filters.races.length === 0 || filters.races.includes(character.race);

					return ageOk && levelOk && raceOk;
				});
			}),
			shareReplay(1),
		);
	}

	loadCharacter() {
		this.allCharacters$ = this.currentUser$.pipe(
			switchMap((user) => {
				if (this.isMyCharacterPage) {
					return this.characterService.getCharactersByUser(user._id);
				}

				return this.characterService.getCharacters().pipe(map((chars) => (user.isAdmin ? chars : chars.filter((c) => c.isPublic))));
			}),
			shareReplay(1), // garde en cache
		);
	}

	createNewCharacter() {
		this.router.navigate(['/create-character']);
	}

	openDeleteModal(character: Character) {
		const modalRef = this.modalService.open(DeleteCharacterModalComponent);
		modalRef.componentInstance.character = character;
		modalRef.componentInstance.confirmDelete.subscribe(() => {
			this.deleteCharacter(character._id);
		});
	}

	deleteCharacter(characterId: string) {
		this.characterService
			.deleteCharacter(characterId)
			.pipe(
				tap(() => {
					this.loadCharacter();
				}),
			)
			.subscribe();
	}

	applyFilters() {
		// Supposons que tu as un tableau characters en mémoire (ou tu récupères via observable)
		// filtre les personnages selon les filtres sélectionnés

		this.characters$ = this.characters$.pipe(
			map((characters) =>
				characters.filter((character) => {
					const ageNum = parseInt(character.age.toString(), 10);

					const ageOk = !isNaN(ageNum) && ageNum >= this.filters.ageRange[0] && ageNum <= this.filters.ageRange[1];
					const levelOk = character.level >= this.filters.levelRange[0] && character.level <= this.filters.levelRange[1];
					return ageOk && levelOk;
				}),
			),
		);
	}
}

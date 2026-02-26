import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { UserService } from 'app/services/LupinoApi/user.service';
import { CharacterFilters } from '../../../types/CharacterFilters';

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

	filters: CharacterFilters = {
		publishedOnly: true,
		upToDate: false,
		mjApproved: false,
		beginners: false,
		hasImage: false,
		levelRange: [1, 10],
		ageRange: [0, 1000],
		races: [],
		selectedCampaign: '',
		strengthRange: [30, 85],
		agilityRange: [30, 85],
		enduranceRange: [30, 85],
		socialRange: [30, 85],
		mentalRange: [30, 85],
	};

	// Toutes les races possibles (à ajuster selon ta data)
	races = ['Humain', 'Elfe', 'Nain', 'Orc', 'Drakéide', 'Gobelin'];

	filtersSubject$ = new BehaviorSubject(this.filters);
	searchText = '';
	searchSubject$ = new BehaviorSubject('');

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

					const agiOk = character.agility >= filters.agilityRange[0] && character.agility <= filters.agilityRange[1];
					const forceOk = character.strength >= filters.strengthRange[0] && character.strength <= filters.strengthRange[1];
					const mentalOk = character.mental >= filters.mentalRange[0] && character.mental <= filters.mentalRange[1];
					const socialOk = character.social >= filters.socialRange[0] && character.social <= filters.socialRange[1];
					const enduranceOk = character.endurance >= filters.enduranceRange[0] && character.endurance <= filters.enduranceRange[1];

					// Pour la race aussi si tu veux filtrer par race
					//const raceOk = filters.races.length === 0 || filters.races.includes(character.race);

					return ageOk && levelOk && forceOk && mentalOk && socialOk && enduranceOk && agiOk;
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

	onFiltersChange(filters: CharacterFilters) {
		if (filters) {
			this.filters = { ...filters };
			this.filtersSubject$.next(this.filters);
		}
	}

	onSearchChange(searchText: string) {
		this.searchText = searchText || '';
		this.searchSubject$.next(this.searchText);
	}
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { Character } from '../../../models/character';
import { CharacterService } from '../../../services/LupinoApi/character.service';
import { DeleteCharacterModalComponent } from '../../modal/delete-character/delete-character.component';
import { UserService } from 'app/services/LupinoApi/user.service';
import { CharacterFilters } from '../../../types/CharacterFilters';
import { CharacterFiltersComponent } from '../filter-character/character-filters.component';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { AsyncPipe } from '@angular/common';
import { Race } from '../../../models/race';
import { RaceService } from '../../../services/LupinoApi/race.service';

@Component({
	selector: 'app-characters',
	templateUrl: './characters.component.html',
	styleUrl: './characters.component.css',
	imports: [CharacterFiltersComponent, CharacterCardComponent, AsyncPipe],
})
export class CharactersComponent {
	raceService = inject(RaceService);
	currentUser$ = this.userService.getUserData().pipe(filter(Boolean), shareReplay(1));
	races$: Observable<Race[]> = this.raceService.getRaces().pipe(shareReplay(1));

	allCharacters$!: Observable<Character[]>; // Source brute
	characters$!: Observable<Character[]>;
	isMyCharacterPage = this.router.url === '/mycharacters';

	raceMap$: Observable<Map<string, string>> = this.races$.pipe(
		map((races) => {
			const m = new Map<string, string>();
			races.forEach((r) => m.set(r._id, r.name));
			return m;
		}),
		shareReplay(1),
	);

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

		this.characters$ = combineLatest([this.allCharacters$, this.filtersSubject$, this.searchSubject$, this.raceMap$]).pipe(
			map(([characters, filters, search, raceMap]) => {
				const raceFilterSet = new Set(filters.races);

				return characters.filter((character) => {
					const q = (search ?? '').trim().toLowerCase();
					const ageNum = Number(character.age) || 0;
					const ageOk = !isNaN(ageNum) && ageNum >= filters.ageRange[0] && ageNum <= filters.ageRange[1];
					const levelOk = character.level >= filters.levelRange[0] && character.level <= filters.levelRange[1];

					const agiOk = character.agility >= filters.agilityRange[0] && character.agility <= filters.agilityRange[1];
					const forceOk = character.strength >= filters.strengthRange[0] && character.strength <= filters.strengthRange[1];
					const mentalOk = character.mental >= filters.mentalRange[0] && character.mental <= filters.mentalRange[1];
					const socialOk = character.social >= filters.socialRange[0] && character.social <= filters.socialRange[1];
					const enduranceOk = character.endurance >= filters.enduranceRange[0] && character.endurance <= filters.enduranceRange[1];

					let characterRaceIds: string[] = [];

					// Nouveau modèle
					if (character.lineage && character.lineage.kind === 'pure') {
						characterRaceIds = [character.lineage.raceId];
					}

					if (character.lineage && character.lineage.kind === 'hybrid') {
						characterRaceIds = character.lineage.parentRaceIds ?? [];
					}

					// Ancien modèle (race = string)
					if (typeof character.race === 'string') {
						// si c'est déjà un id connu
						if (raceMap.has(character.race)) {
							characterRaceIds = [character.race];
						} else {
							// sinon c'est un nom → on cherche l'id correspondant
							for (const [id, name] of raceMap.entries()) {
								if (name === character.race) {
									characterRaceIds = [id];
									break;
								}
							}
						}
					}

					// 🎯 filtre final
					const raceOk = raceFilterSet.size === 0 || characterRaceIds.some((id) => raceFilterSet.has(id));

					const textOk = !q || (character.name ?? '').toLowerCase().includes(q) || (character.owner.name ?? '').toLowerCase().includes(q);

					return ageOk && levelOk && forceOk && mentalOk && socialOk && enduranceOk && agiOk && textOk && raceOk;
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
